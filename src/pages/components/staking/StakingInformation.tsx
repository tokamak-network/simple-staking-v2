import { modalData, modalState } from "@/atom/global/modal";
import { minimumAmountState } from "@/atom/staking/minimumAmount";
import { selectedToggleState, toggleState } from "@/atom/staking/toggle";
import { selectedTypeState, typeFilterState } from "@/atom/staking/txTypeFilter";
import HistoryTable from "@/common/table/staking/HistoryTable";
import OperatorDetailInfo from "@/common/table/staking/OperatorDetail";
import { getOldLayerAddress } from "@/components/getOldLayerAddress";
import { getCommitHistory, getTransactionHistory } from "@/components/getTransactionHistory";
import { convertNumber } from "@/components/number";
import { useExpectedSeig } from "@/hooks/staking/useCalculateExpectedSeig";
import { usePendingUnstaked } from "@/hooks/staking/usePendingUnstaked";
import { useWithdrawable } from "@/hooks/staking/useWithdrawable";
import useUserBalance from "@/hooks/useUserBalance";
import { StakeModalDataType } from "@/types";
import { ModalType } from "@/types/modal";
import { Box, Flex } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import WalletInformation from "./WalletInformation";
import { useWithdrawRequests } from '../../../hooks/staking/useWithdrawable';


type StakingInformationProps = {
  // dispatch: AppDispatch;
  data: any;
};

export const StakingInformation: FC<StakingInformationProps> = ({
  data
}) => {
  const { account } = useWeb3React();
  const txHistory = getTransactionHistory(data)
  const commitHistory = getCommitHistory(data)

  const txTypeValue = useRecoilValue(selectedTypeState)
  const [toggle, setToggle] = useRecoilState(toggleState)
  const [typeFilter, setTypeFilter] = useRecoilState(typeFilterState);
  const [filteredTxHistory, setFilteredTxHistory] = useState(txHistory);
  const [transactionTab, setTransactionTab] = useState(false);

  const [candidateContracts, setCandidateContracts] = useState('');
  const [candidates, setCandidates] = useState('');
  const [stakeOfUser, setStakeOfUser] = useState('');
  const [expSeig, setExpSeig] = useState('');
  const [name, setName] = useState('');
  const [stakeCandidate, setStakeCandidate] = useState('');
  // const [minimumAmount, setMinimumAmount] = useRecoilState(minimumAmountState)
  const [isOperator, setIsOperator] = useState<boolean>(false);
  const [isL2, setIsL2] = useState<boolean>(false);

  const [selectedModal, setSelectedModal] = useRecoilState(modalState);
  const [, setSelectedModalData] = useRecoilState(modalData);

  const { withdrawRequests } = useWithdrawRequests()
  

  const historyColumns = useMemo(
    () => [
      {
        Header: 'Account Address',
        accessor: 'account',
      },
      {
        Header: 'TX Hash',
        accessor: 'txHash',
      },
      {
        Header: 'Type',
        accessor: 'txType',
      },
      {
        Header: 'Amount',
        accessor: 'amount',
      },
      {
        Header: 'Date',
        accessor: 'date',
      }
    ],
    [],
  );

  useEffect(() => {
    setTypeFilter('All')
  }, [])

  useEffect(() => {
    account ? setToggle('My') : setToggle('All')
  }, [account])

  const { pendingUnstaked } = usePendingUnstaked(data?.candidateContract, account);
  const { withdrawable, withdrawableLength, old_withdrawable, old_withdrawableLength, requests } = useWithdrawable(
    data?.candidateContract,
  );
  const { userTonBalance, userWTonBalance } = useUserBalance(account);

  useEffect(() => {
    if (data) {
      setCandidateContracts(data.candidateContract);
      setCandidates(data.candidate);
      setStakeOfUser(data.stakeOf);
      setExpSeig(data.expectedSeig);
      setStakeCandidate(data.stakeOfCandidate);
      setIsL2(data.candidateAddOn !== null)
      setName(data.name)
    }
  }, [data]);
  
  useEffect(() => {
    async function fetch () {
      if (txHistory) {
        const filtered = txTypeValue === 'All' 
          ? txHistory 
          : txHistory.filter((history: any) => {
            return history.eventName === txTypeValue
          })
        const toggleFilter = toggle === 'All' 
          ? filtered
          : filtered.filter((history: any) => {
            return history.sender.toLowerCase() === account?.toLowerCase()
          })
        //@ts-ignore
        const pendingRequests = await withdrawRequests(data.candidateContract)
        // console.log(withdrawRequest)
        let toggleWithdrawble: any[] = [];
        for (let i = 0; toggleFilter.length > i; i ++) {
          if (toggleFilter[i].eventName === 'Unstake') {
            const withdrawable = pendingRequests.find((request: any) => {
              return Number(request.withdrawableBlock) === Number(toggleFilter[i].transaction.blockNumber) + 93046
                    || Number(request.withdrawableBlock) === Number(toggleFilter[i].transaction.blockNumber) + 930460
            })
            // console.log(withdrawable)
            const data = { 
              ...toggleFilter[i], 
              withdrawable: withdrawable ? true : false, 
              withdrawn: i + 1 > pendingRequests.length
              // withdrawableBlock: request.withdrawableBlock 
            } 
            toggleWithdrawble.push(data);
          } else {
            toggleWithdrawble.push(toggleFilter[i]);
          }
        }
        
        setFilteredTxHistory(toggleWithdrawble)
      }
    }
    fetch()

  }, [txTypeValue, toggle, data?.candidateContract])

  const candidateAmount = data?.stakeOfCandidate ? convertNumber({
    amount: data?.stakeOfCandidate,
    type: 'ray'
  }) : '0.00'

  const minimumAmount = Number(candidateAmount) >= 1000
  
  const { expectedSeig, seigOfLayer } = useExpectedSeig(data?.candidateContract, data?.stakedAmount, data?.candidate)
  

  const expectedSeigs = expSeig
    ? convertNumber({
        amount: expSeig,
        type: 'ray',
        localeString: true,
      })
    : '0.00';

  const yourStaked = stakeOfUser
    ? convertNumber({
        //@ts-ignore
        amount: stakeOfUser,
        type: 'ray',
        localeString: true,
      })
    : '-';
  
  const dataModal: StakeModalDataType = {
    tonBalance: userTonBalance ? userTonBalance : '0.00',
    wtonBalance: userWTonBalance ? userWTonBalance : '0.00',
    stakedAmount: yourStaked ? yourStaked : '0.00',
    layer2: candidateContracts,
    withdrawableLength: withdrawableLength,
    seig: expectedSeigs ? expectedSeigs : '0.00',
    candidate: candidates,
    minimumAmount: minimumAmount,
    pendingUnstaked: pendingUnstaked,
    withdrawable: withdrawable,
    // old_withdrawableLength: old_withdrawableLength,
    old_withdrawableLength: '1',
    old_withdrawable: old_withdrawable,
    old_layer2: getOldLayerAddress(candidateContracts) ? getOldLayerAddress(candidateContracts) : '',
    requests: requests,
    isL2: isL2,
    name: name
  };
  
  const modalButton = useCallback(async (modalType: ModalType, data: any) => {
    setSelectedModal(modalType);
    setSelectedModalData(data);
  }, [candidateContracts]);

  return (
    <Flex
      w="960px"
      m={0}
      justifyContent={'center'}
      alignItems="center"
      // pt="70px"
      border={'none'}
      flexDir={'column'}
      ml={'70px'}
    >
      <Flex alignItems={'center'} justifyContent={'center'} w={'960px'} >
        <Box p={0}  borderRadius={'10px'} alignSelf={'flex-start'}>
          <WalletInformation 
            data={data}
            commitHistory={commitHistory}
          />
        </Box>
          <Flex flexDir={'row'} alignItems={'space-between'} ml={'45px'} w={'585px'}>
            <OperatorDetailInfo 
              title={'Staked'}
              value={data?.stakeOf}
              totalValue={data.stakedAmount}
              unit={'TON'}
              type={''}
              dataModal={()=> modalButton('withdraw', dataModal)}
            />
            <OperatorDetailInfo 
              title={'Unclaimed Staking Reward'}
              value={expectedSeig}
              totalValue={seigOfLayer}
              unit={'TON'}
              type={''}
              contractInfo={data?.candidateContract}
              candidate={data?.candidate}
              minimumAmount={minimumAmount}
            />
            <OperatorDetailInfo 
              title={'Pending Withdrawal'}
              value={pendingUnstaked}
              totalValue={data?.pending}
              unit={'TON'}
              type={''}
              dataModal={()=>modalButton('restake', dataModal)}
            />
          </Flex>
        
      
      </Flex>
      <Flex flexDir={'row'} h={'30px'} justifyContent={'center'} alignItems={'center'} my={'30px'}>
        <Flex w={'150px'} h={'1px'} background={'linear-gradient(90deg, rgba(231, 235, 242, 0.00) 0%, #E7EBF2 100%)'}/>
        <Flex 
          borderRadius={'14px'}
          border={'1px solid #e7ebf2'}
          w={'100px'}
          h={'25px'}
          fontSize={'12px'}
          fontWeight={500}
          color={'#304156'}
          justifyContent={'center'}
          alignItems={'center'}
          onClick={()=> setTransactionTab(transactionTab ? false : true)}
          cursor={'pointer'}
        >
          {transactionTab ? 'Close' : 'Transactions'}
        </Flex>
        <Flex w={'150px'} h={'1px'} background={'linear-gradient(90deg, #E7EBF2 0%, rgba(231, 235, 242, 0.00) 100%)'}/>
      </Flex>
      {/* table area */}
      {
        transactionTab ?
        <Flex 
          flexDir={'row'} 
          justifyContent={'center'} 
          alignItems={'center'}
        >
          {
            commitHistory &&
            <HistoryTable 
              columns={historyColumns}
              data={commitHistory}
              tableType={'Update Seigniorage'}
              dataModal={dataModal}
            />
          }
          {
            filteredTxHistory &&
            <HistoryTable 
              columns={historyColumns}
              data={filteredTxHistory}
              tableType={'Transactions'}
              dataModal={dataModal}
            />
          }
        </Flex> : ''
      }
    </Flex>
  )
} 

export default StakingInformation