import { getOperatorUserHistory, getOperatorsInfo } from '@/api';
import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';
import useCallContract from '../useCallContract';
import { useBlockNumber } from '../useBlockNumber';
import { GET_HISTORY } from '@/graphql/query/getUserHIstory';
import { useQuery } from '@apollo/client';
import { getTransactionHistory } from '../../utils/getTransactionHistory';
import { useGetUserHistory } from '../graphql/useGetUserHistory';
import { useWithdrawRequests } from '../staking/useWithdrawable';

export function useUserHistory () {
  const [userHistory, setUserHistory] = useState([])
  const { blockNumber } = useBlockNumber()
  const { account } = useWeb3React();
  
  const { users } = useGetUserHistory(account)
  const { withdrawRequests } = useWithdrawRequests()

  useEffect(() => {
    async function fetchList () {  
      if (account && users) {
        const pastData = await getOperatorsInfo();
        
        let myHistory: any = [];
        let fixedUnstaked: any = [];
        await Promise.all(pastData.map(async (obj: any) => {
          const history = await getOperatorUserHistory(obj.layer2.toLowerCase(), account.toLowerCase());
          const pendingRequests = await withdrawRequests(obj.layer2.toLowerCase());
          const unstakeHistoryPerLayer = users[0].unstaked.filter((unstake: any) => unstake.candidate.id === obj.layer2.toLowerCase())
          console.log(pendingRequests)
          let fixWithdrawble: any[] = [];
          for (let i = 0; unstakeHistoryPerLayer.length > i; i ++) {           
            
              const withdrawable = pendingRequests.find((request: any) => {
                return Number(request.withdrawableBlock) === Number(unstakeHistoryPerLayer[i].transaction.blockNumber) + 93046
                      || Number(request.withdrawableBlock) === Number(unstakeHistoryPerLayer[i].transaction.blockNumber) + 930460
              })
              console.log(withdrawable)
              const data = { 
                ...unstakeHistoryPerLayer[i], 
                withdrawable: withdrawable ? true : false, 
                withdrawn: i + 1 > pendingRequests.length
                // withdrawableBlock: request.withdrawableBlock 
              } 
              fixWithdrawble.push(data);
          
          }

          fixedUnstaked = [...fixedUnstaked, ...fixWithdrawble]
          myHistory = [...myHistory, ...history]
          return await myHistory
        }))
        
        myHistory = myHistory.sort(function (a: any, b: any) {
          return b.blockNumber - a.blockNumber
        })

        if (users[0]) {
          const txData = getTransactionHistory({
            staked: fixedUnstaked,
            unstaked: users[0].staked,
            withdrawal: users[0].withdrawal,
            withdrawL2: users[0].withdrawL2, 
            oldHistory: myHistory
          })

          let datas: any = []
          for (let i = 0; i < txData.length ; i++) {
            

            const indexedData = {
              ...txData[i],
              index: txData.length - i - 1
            }
            datas.push(indexedData)
          }
          setUserHistory(datas)
        }
      }
    }
    fetchList()
  }, [account, users])

  return { userHistory }
}

