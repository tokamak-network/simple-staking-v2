import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchUserTransactions } from "utils/fetchUserTransactions";

import {
  SentMessages,
  UserL2Transaction,
  FullDepTx,
} from "@/types/history";
// @ts-ignore
import * as titanSDK from "@tokamak-network/tokamak-layer2-sdk";
// import { userTransactions } from "@/recoil/userHistory/transaction";
import { useRecoilState } from "recoil";
import { userTransactions } from "@/atom/staking/transaction";
import { useWeb3React } from "@web3-react/core";
import { TITAN_RPC } from "@/constants";
import { ethers } from "ethers";
import { refreshState } from "@/atom/staking/refresh";

export default function useGetTransaction() {
  const [tDataDeposit, setTDataDeposit] = useState<FullDepTx[]>([]);
  const [tDataWithdraw, setTDataWithdraw] = useState<any[]>([]);
  const [refresh, setRefresh] = useRecoilState(refreshState)
  
  const { library, account } = useWeb3React();
  // const account = '0x43700f09B582eE2BFcCe4b5Db40ee41B4649D977'
  const l2Provider = new ethers.providers.JsonRpcProvider(TITAN_RPC)
  //titanSDK as an L2 provider for certain functions
  const l2ProSDK = titanSDK.asL2Provider(l2Provider);

  //use metamask provider if connected to L1 and use tokamak ethereum provider if connected to L2
  const l1Pro = library

  //recoil state to store the txs from the subgraph
  const [userTxfromSubgraph, setUserTxfromSubgraph] =
    useRecoilState(userTransactions);

  const isConnectedToMainNetwork = false

  //state tot check whether the deposit data is absent or if data is loading and present
  const [depositLoading, setDepositLoading] = useState<
    "loading" | "present" | "absent"
  >("loading");

  //data from the subgraphs are re-fetched every time the user address, connected layer, or the network status changes
  useEffect(() => {
    const subgraphData = async () => {
      if (isConnectedToMainNetwork !== undefined && account && refresh) {
        const userAllTransactions = await fetchUserTransactions(
          account,
          isConnectedToMainNetwork
        );
        setRefresh(false)
        return setUserTxfromSubgraph(userAllTransactions);
      }
      
    };
    subgraphData();
  }, [account, isConnectedToMainNetwork, refresh]);

  //this function fetches the deposit txs and their data and reformats the data
  //takes the input boolean parameter 'set' to check if the loading status of the txs should be set or not
  const fetchDepositTransactions = useCallback(
    async (set: boolean) => {
      if (
        l2ProSDK !== undefined &&
        l1Pro !== undefined &&
        userTxfromSubgraph !== undefined
      ) {
        //if 'set' parameter is set to true and there are formatted deposit txs coming from the subgraph,
        //set the deposit tx loading status to 'loading' and if not to 'absent'
        set && userTxfromSubgraph?.formattedL1DepositResults.length > 0
          ? setDepositLoading("loading")
          : setDepositLoading("absent");

        //creates an array for all the txs in the userTxfromSubgraph.formattedDeposit data with additional information
        // these are the deposit txs that are already appeared on L2
        const l2DepTxs = await Promise.all(
          userTxfromSubgraph.formattedDeposit
            .map(async (tx: UserL2Transaction) => {
              
              //gets the l1 deposit tx data from the titan sdk
              const l1Tx = await l2ProSDK.getTransaction(tx.transactionHash);

              //gets the l2 block from the titan sdk
              const l2block = await l2ProSDK.getBlock(Number(tx.blockNumber));

              //gets the l1 block from the titan sdk using the l2 deposit tx data fetched form the SDK
              const l1Block = await l1Pro.getBlock(Number(l1Tx.l1BlockNumber)); ///take a look to use proviver instead of tokamak provider

              // filter the corresponding subgraph tx for this tx using the message Nonce
              const l1tx = userTxfromSubgraph.formattedL1DepositResults?.filter(
                (l1tx: SentMessages) => {
                  return Number(l1tx.messageNonce) === l1Tx.nonce;
                }
              );
              // console.log(l1tx)

              //if there is a corresponding tx from the subgraph exists return the following data
              if (l1tx.length > 0) {
                const l1TxHash = l1tx[0].transactionHash;
                const l1timeStamp = Number(l1tx[0].blockTimestamp);
                let txCopy = {
                  ...tx,
                  ...l1Tx,
                  l2block: l2block,
                  l2timeStamp: l2block.timestamp,
                  l1timeStamp: l1timeStamp,
                  l1Block: l1Block,
                  l2txHash: tx.transactionHash,
                  l1txHash: l1TxHash,
                  event: "deposit",
                  _amount: l1tx[0]._amount,
                  _l1Token: l1tx[0]._l1Token,
                  _l2Token: l1tx[0]._l2Token,
                };
                return txCopy;
              }
            })
            .sort(
              (tx1: UserL2Transaction, tx2: UserL2Transaction) =>
                tx1.blockNumber - tx2.blockNumber
            ) //sort the txs by the block number in ascending order
        );

        //all the deposit txs in l1 including txs with corresponding l2 txs and txs without l2 txs
        const l1DepTxs = await Promise.all(
          userTxfromSubgraph.formattedL1DepositResults.map(async (tx: any) => {
            //filter the txs with a corresponding l2 tx using the message nonce
            const l2tx = l2DepTxs.filter((l2tx: FullDepTx) => {
              return (
                l2tx !== undefined && l2tx.nonce === Number(tx.messageNonce)
              );
            });
            
            //if there is a corresponding l2 tx return the following data
            if (l2tx.length > 0) {
              const l1Block = l2tx[0].l1Block;
              const l1timeStamp = l1Block.timestamp;
              let txCopy = {
                ...tx,
                l2timeStamp: l2tx[0].l2timeStamp,
                l1timeStamp: l1timeStamp,
                l1Block: l1Block,
                l2txHash: l2tx[0].transactionHash,
                l1txHash: tx.transactionHash,
                _amount: tx._amount,
                _l1Token: tx._l1Token,
                _l2Token: tx._l2Token,
              };
              return txCopy;
            }
            //if there is no l2 tx, return this information
            else {
              const l1Block = await l1Pro.getBlock(Number(tx.blockNumber));
              const l1timeStamp = l1Block.timestamp;
              let txCopy = {
                ...tx,
                l1timeStamp: l1timeStamp,
                l1txHash: tx.transactionHash,
              };
              return txCopy;
            }
          })
        );

        const txLogs = l1DepTxs;

        //if the length of the above l1DepTxs array > 0 and if the userTxfromSubgraph.formattedL1DepositResults.length > 0 set the loading status to present
        const status =
          txLogs.length > 0
            ? "present"
            : userTxfromSubgraph?.formattedL1DepositResults.length === 0 //if there are no txs from subgraph set the loading status to absent
            ? "absent"
            : "loading";
        setDepositLoading(status);

        return setTDataDeposit(txLogs);
      }
    },
    [userTxfromSubgraph, account]
  );

  //when the subgraph data, the connected layer or the network changes, refetch both withdraw and deposit txs
  useEffect(() => {
    fetchDepositTransactions(true);
  }, [userTxfromSubgraph, isConnectedToMainNetwork]);

  //if none of the queries in the fetchUserTransactions returns any txs, set the loading status to absent
  const stat = useMemo(() => {
    if (
      userTxfromSubgraph !== undefined &&
      userTxfromSubgraph.formattedDeposit.length === 0 &&
      userTxfromSubgraph.formattedL1DepositResults.length === 0
      // userTxfromSubgraph.formattedL1WithdrawResults.length === 0 &&
      // userTxfromSubgraph.formattedWithdraw.length === 0
    ) {
      return "absent";
    }
    //set the overa;; loading state according to the loading state of each deposit & withdraw
    return depositLoading === "loading"
      ? "loading"
      : depositLoading === "absent"
      ? "absent"
      : depositLoading === "present"
      ? "present"
      : "loading";
  }, [account, depositLoading]);

  //if there is not subgraph data for any of the tx types, return empty arrow
  const allTxs =
    userTxfromSubgraph !== undefined &&
    userTxfromSubgraph.formattedDeposit.length === 0 &&
    userTxfromSubgraph.formattedL1DepositResults.length === 0 
    // userTxfromSubgraph.formattedL1WithdrawResults.length === 0 &&
    // userTxfromSubgraph.formattedWithdraw.length === 0
      ? []
      : stat === "present" //if there are tx data, sort them according to the following criteria
      ? tDataWithdraw
          .concat(tDataDeposit)
          .sort((tx1: FullDepTx, tx2: FullDepTx) =>
            // Number(tx2.l1timeStamp) - Number(tx1.l1timeStamp) ||
            // Number(tx1.l2timeStamp) - Number(tx2.l2timeStamp)
            tx2.l1timeStamp && tx1.l1timeStamp
              ? Number(tx2.l1timeStamp) - Number(tx1.l1timeStamp)
              : tx2.l1timeStamp && tx1.l1timeStamp === undefined
              ? Number(tx2.l1timeStamp) - Number(tx1.l2timeStamp)
              : tx2.l1timeStamp === undefined && tx1.l1timeStamp
              ? Number(tx2.l2timeStamp) - Number(tx1.l1timeStamp)
              : Number(tx2.l2timeStamp) - Number(tx1.l2timeStamp)
          )
      : [];

  return { depositTxs: allTxs, loadingState: stat };
}
