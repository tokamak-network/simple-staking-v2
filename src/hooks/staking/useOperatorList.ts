import { getEventByLayer2, getOperatorsInfo, getDelegators, getOperatorUserHistory } from "@/api";
import { useEffect, useState } from 'react';
import { NON_CANDIDATE } from "@/constants";
import { useActiveWeb3React } from "hooks/useWeb3";


export function useOperatorList() {
  const [operatorList, setOperatorList] = useState([]);
  //@ts-ignore
  // const { account } = useActiveWeb3React();

  useEffect(() => {
    async function fetchList () {
      const data = await getOperatorsInfo();

      const operators = await Promise.all(data.map(async (obj: any) => {
        // console.log(account)
        // const history = await getEventByLayer2(obj.layer2.toLowerCase(), 'Deposited,WithdrawalRequested,WithdrawalProcessed')
        const history = await getOperatorUserHistory(obj.layer2.toLowerCase())
        const commitHistory = await getEventByLayer2(obj.layer2.toLowerCase(), 'Comitted', 1, 300)
        // console.log(history)
        const delegators = await getDelegators(obj.layer2.toLowerCase())
        const fetchedData = {
          ...obj, 
          operatorsHistory: history, 
          delegators: delegators.length,
          commit: commitHistory
        }
        const find = NON_CANDIDATE.find(data => data.layer2 === obj.layer2)
        return find ? 
          await { ...fetchedData, name: find.name } : await fetchedData
      }))
      
      if (operators) {
        operators.sort(function(a: any, b: any) {
          return b.updateCoinageTotalString - a.updateCoinageTotalString
        })
        //@ts-ignore
        setOperatorList(operators)
      }
    }
    fetchList()
  }, [])

  return { operatorList }
}

export default useOperatorList