import { getEventByLayer2, getOperatorsInfo, getDelegators, getOperatorUserHistory } from "@/api";
import { useEffect, useState } from 'react';
import { NON_CANDIDATE } from "@/constants";
import { useWeb3React } from '@web3-react/core';
import { convertNumber } from '@/utils/number';
import useCallContract from '@/hooks/useCallContract';
import { BigNumber } from 'ethers';
import { useRecoilValue } from 'recoil';
import { txState } from '@/atom/global/transaction';
import { useWindowDimensions } from "../useWindowDimensions";
// import { useCandidateList } from './useCandidateList';
import { GET_CANDIDATE } from "@/graphql/getCandidates";
import { useQuery } from "@apollo/client";

export function useOperatorList() {
  const [operatorList, setOperatorList] = useState([]);
  const [userTotalStaked, setUserTotalStaked] = useState('0.00')
  const [totalStaked, setTotalStaked] = useState<string>()
  const { account } = useWeb3React();
  const { DepositManager_CONTRACT, SeigManager_CONTRACT } = useCallContract();
  // const { WTON_ADDRESS} = CONTRACT_ADDRESS;
  const tx = useRecoilValue(txState)
  const [width] = useWindowDimensions();
  // const { data } = useQuery(GET_CANDIDATE);
  useEffect(() => {
    async function fetchList() {
      const data = await getOperatorsInfo();
      
      let staked = BigNumber.from('0')
      let totalStake: BigNumber = BigNumber.from('0')
      // if (account && SeigManager_CONTRACT) {
      //   const stake = await SeigManager_CONTRACT.stakeOf(
      //     '0x1f4aef3a04372cf9d738d5459f31950a53969ca3',
      //     '0xf3d37602d501dc27e1bdbc841f174adf337909d2'
      //   )
      //   console.log('stakeOf', account, '0x1f4aef3a04372cf9d738d5459f31950a53969ca3', stake.toString())
      //   // commisionRates = await SeigManager_CONTRACT.commissionRates(obj.layer2)
      // }
      // console.log(data?.candidates[0])
      const operators = await Promise.all(data.map(async (obj: any) => {
      // const operators = await Promise.all(data?.candidates.map(async (obj: any) => {
        // const history = await getOperatorUserHistory(obj.layer2.toLowerCase())
        // const commitHistory = await getEventByLayer2(obj.layer2.toLowerCase(), 'Comitted', 1, 300)
        // const blockNumber = library && await library.getBlockNumber();
        // const candidates = await getCandidates()
        // const events = await getCandidateCreateEvent();
        // const Layer2 = getContract(obj.layer2, Layer2ABI, library)
        // const delegators = await getDelegators(obj.layer2.toLowerCase())

        let pendingUnstakedLayer2
        let stakeOf = '0'
        let commisionRates = undefined
        if (DepositManager_CONTRACT) {
          pendingUnstakedLayer2 = await DepositManager_CONTRACT.pendingUnstakedLayer2(obj.candidateContract)
        }
        
        if (account && SeigManager_CONTRACT) {
          // stakeOf = await SeigManager_CONTRACT.stakeOf(obj.candidateContract, account)
          // console.log('stakeOf', account, obj.candidateContract, stakeOf.toString())
          // commisionRates = await SeigManager_CONTRACT.commissionRates(obj.layer2)
        }

        const pendingWithdrawal = pendingUnstakedLayer2 ? convertNumber({
          amount: pendingUnstakedLayer2.toString(),
          type: 'ray',
          localeString: true,
        }) : '-'
        
        totalStake = obj.updateCoinageTotalString ? totalStake.add(obj.updateCoinageTotalString) : BigNumber.from('0')
        staked = staked.add(stakeOf)
        const yourStaked = convertNumber({
          amount: stakeOf.toString(),
          type: 'ray',
          localeString: true
        })
        // const commissionRate = commisionRates ? convertNumber({
        //   amount: commisionRates.toString(),
        //   type: 'wei',
        // }) : '-'
        const commissionRate = '-'
        const find = NON_CANDIDATE.find(data => data.layer2 === obj.layer2)
        const fetchedData = {
          ...obj,
          operatorsHistory: history,
          delegators: 0,
          commit: [],
          pendingWithdrawal: pendingWithdrawal,
          yourStaked: '0',
          commissionRate: commissionRate,
   
        }
        // const find = NON_CANDIDATE.find(data => data.layer2 === obj.layer2)
        return find ?
          await { ...fetchedData, name: find.name } : await fetchedData
      }))

      setTotalStaked(totalStake.toString())
      setUserTotalStaked(staked.toString())

      if (operators) {
        operators.sort(function (a: any, b: any) {
          return b.updateCoinageTotalString - a.updateCoinageTotalString
        })
        //@ts-ignore
        setOperatorList(operators)
      }
    }
    fetchList()
  }, [DepositManager_CONTRACT, SeigManager_CONTRACT, account, setTotalStaked,width])

  return { operatorList, userTotalStaked, totalStaked, tx }
}

export default useOperatorList