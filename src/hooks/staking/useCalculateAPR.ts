import { getCommitHistory } from "@/utils/getTransactionHistory";
import { useState, useEffect } from 'react';
import { useStakingInformation } from "./useStakingInformation";

export function useCalculateAPR (data: any) {
  const commitHistory = getCommitHistory(data)
  const { stakingInfo } = useStakingInformation()
  const [compound, setCompound] = useState('0.00')
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
    if (stakingInfo) {
      const apr = stakingInfo[1].value
      
      //@ts-ignore
      const convertedAPR = apr === 0 ? 0.35 : Number(apr.slice(1)) / 100
      
      const numOfCompounds = compounds.length === 0 ? 1 : compounds.length
      const expectedAPR = (1+convertedAPR/numOfCompounds)**numOfCompounds - 1
      
      setCompound((expectedAPR * 100).toLocaleString(undefined, {maximumFractionDigits: 2, minimumFractionDigits: 2}))
    }
  }, [stakingInfo])
  
  return compound
}