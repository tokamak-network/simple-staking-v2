import { getOperatorUserHistory, getOperatorsInfo } from '@/api';
import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';
import useCallContract from '../useCallContract';
import { BigNumber } from 'ethers';
import { range } from 'lodash'
import { useBlockNumber } from '../useBlockNumber';
import { GET_HISTORY } from '@/graphql/getUserHIstory';
import { useQuery } from '@apollo/client';
import { getTransactionHistory } from '../../utils/getTransactionHistory';

export function useUserHistory () {
  const [userHistory, setUserHistory] = useState([])
  const { blockNumber } = useBlockNumber()
  const { account } = useWeb3React();
  const {data} = useQuery(GET_HISTORY, {
    variables: {
      id: account?.toLowerCase()
    },
    pollInterval: 10000
  });
  // const [totalStaked, setTotalStaked] = useState('0.00')
  const { DepositManager_CONTRACT , SeigManager_CONTRACT} = useCallContract();

  useEffect(() => {
    async function fetchList () { 
      console.log(data) 
      if (account && data.users) {
        const pastData = await getOperatorsInfo();

        // let staked = BigNumber.from('0')
        let myHistory: any = []

        await Promise.all(pastData.map(async (obj: any) => {
          let stakeOf = '0'

          const history = await getOperatorUserHistory(obj.layer2.toLowerCase(), account.toLowerCase())
          
          // if (account && SeigManager_CONTRACT && DepositManager_CONTRACT) {
          //   stakeOf = await SeigManager_CONTRACT.stakeOf(obj.layer2, account)
          // }
          // staked = staked.add(stakeOf)

          myHistory = [...myHistory, ...history]
          return await myHistory
        }))
        const {staked, unstaked, withdrawal} = data.users[0]
        // console.log(staked, unstaked, withdrawal)
        const txData = getTransactionHistory({...data.users[0], oldHistory: myHistory})
        console.log(txData)
        setUserHistory(txData)
      }
    }
    fetchList()
  }, [DepositManager_CONTRACT, SeigManager_CONTRACT, account, blockNumber, data])

  return { userHistory }
}