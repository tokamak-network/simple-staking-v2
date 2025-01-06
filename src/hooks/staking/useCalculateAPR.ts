import { getCommitHistory } from "@/utils/getTransactionHistory";
import { useState, useEffect } from 'react';
import { useStakingInformation } from "./useStakingInformation";

export function useCalculateAPR (data: any) {
  const commitHistory = getCommitHistory(data)
  const { roi } = useStakingInformation()
  const [compound, setCompound] = useState('00.00')
  const month = 2629743;
  const now = Date.now()
  
  let compounds = []
  for (let i = 0; i < 12; i ++) {
    const a = commitHistory?.find((history: any) => {   
      return history.timestamp < (now / 1000) - month * i && history.timestamp > (now / 1000) - (i+1) * month
    })
    
    a ? compounds.push(a) : a
  }
  useEffect(() => {
    if (roi !== 0 && roi !== Infinity) {
      // value which title is 'Average APR' in stakingInfo
      const apr = roi
      
      //@ts-ignore
      const convertedAPR = apr === 0 ? 0.35 : Number(apr) / 100
      const numOfCompounds = compounds.length === 0 ? 1 : compounds.length
      const expectedAPR = (1 + convertedAPR / numOfCompounds) ** numOfCompounds - 1
      
      setCompound((expectedAPR * 100).toLocaleString(undefined, {maximumFractionDigits: 2, minimumFractionDigits: 2}))
    }
  }, [roi])
  
  return compound
}