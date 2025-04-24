import axios from "axios";
import { L1TxType, SentMessages } from "@/types/history";
import CONTRACT_ADDRESS, { MAINNET, SEPOLIA } from "@/services/addresses/contract";
import { GRAPHQL_API, TITAN_SUBGRAPH } from "@/constants";

const formatAddress = (address: string) => {
  const formattedAddress = address.substring(2);
  return formattedAddress;
};

export const fetchUserTransactions = async (
  account: string | undefined,
  isConnectedToMainnet: boolean
) => {
  if (account) {
    const {
      L1Bridge,
      DepositManager_ADDRESS,
      TON_ADDRESS
    } = CONTRACT_ADDRESS
    
    const formattedAddress = formatAddress(DepositManager_ADDRESS);
    const formattedAccount = formatAddress(account)
    
    //gets transactions on L1
    const resTxs = await axios.post(
      `${GRAPHQL_API}`,
      {
        query: `
        {
          sentMessages(
          where: {message_contains: "${formattedAddress}", sender: "${L1Bridge}", target: "0x4200000000000000000000000000000000000010"}
        ) {
          blockNumber
          blockTimestamp
          gasLimit
          message
          messageNonce
          sender
          target
          transactionHash
        }
         erc20DepositInitiateds(
          where: {_from: "${DepositManager_ADDRESS}"}
        ) {
          id
          _l1Token
          _l2Token
          _from
          _amount
          _data
          _to
          blockNumber
          blockTimestamp
          transactionHash
        }
  
      }`,
        variables: null,
      }
    );
    
    //gets transactions on L2
    const withdrawTx = await axios.post(
      `${TITAN_SUBGRAPH}`,
      {
        query: `
        {
          sentMessages(
            where: {
              message_contains: "${formattedAddress}", 
              target: "${L1Bridge}", 
              sender: "0x4200000000000000000000000000000000000010"
            }
          ) {
            blockNumber
            blockTimestamp
            gasLimit
            message
            messageNonce
            sender
            target
            transactionHash
          }
          depositFinalizeds(where: {_from: "${DepositManager_ADDRESS}", _to: "${account}", _l1Token: "${TON_ADDRESS}"}) {
            id
            _l1Token
            _l2Token
            _from
            _amount
            _data
            _to
            blockNumber
            blockTimestamp
            transactionHash
          }
            
        }`,
        variables: null,
      }
    );
    
    const depositTxsL2 = withdrawTx.data.data.depositFinalizeds; //filter the deposit finalized txs on L2
    
    //add the even name to the deposit txs
    const formattedDeposit = depositTxsL2.map((tx: SentMessages) => {
      let copy = {
        ...tx,
        event: "deposit",
      };
      return copy;
    });
    
    //combine the erc20 deposits and eth deposits on L1
    const allDepL1Txs = [
      ...resTxs.data.data.erc20DepositInitiateds,
    ];

    const formattedL1DepositResultsUnfiltered =
      //combine the txs in sent messages and l1 deposit txs and add event name
      resTxs.data.data.sentMessages.map((result: SentMessages) => {
        //filter txs from all the l1 deposit txs where the user address occurs twice and the tx hash has a match in the sentMessages on L1
        const tx = allDepL1Txs.filter((tx: L1TxType) => {
          const regexContract = new RegExp(
            `${formattedAddress.toLocaleLowerCase()}`,
            "g"
          );

          const regexAccount = new RegExp(
            `${formattedAccount.toLocaleLowerCase()}`,
            "g"
          );
          
          const occurrenceContract = result.message.match(regexContract)?.length;
          const occurrenceAccount = result.message.match(regexAccount)?.length;
          
          return (
            tx.transactionHash === result.transactionHash && occurrenceContract === 1 && occurrenceAccount === 1
          );
        })[0];
        
        let copy = {
          ...result,
          ...tx,
          event: "deposit",
        };
        if (tx !== undefined) {
          return copy;
        }
      });
      
    //filter out any undefined txs from the array of results from the above array
    const formattedL1DepositResults =
      formattedL1DepositResultsUnfiltered.filter((tx: any) => tx !== undefined);

    return {
      formattedL1DepositResults,
      formattedDeposit,
    };
  }
};
