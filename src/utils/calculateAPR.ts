import { getCommitHistory } from "@/utils/getTransactionHistory";
import { useState, useEffect } from 'react';
import { calculateRoiBasedonCompound } from "./calculateRoi";
import useCallContract from "@/hooks/useCallContract";

export async function calculateAPR (roi: any, data: any, SeigManager_CONTRACT: any) {
  const commitHistory = getCommitHistory(data)
  
  const month = 2629743;
  const now = Date.now()
  
  let compounds = []
  for (let i = 0; i < 12; i ++) {
    const compound = commitHistory?.find((history: any) => {   
      return history.timestamp < (now / 1000) - month * i && history.timestamp > (now / 1000) - (i+1) * month
    })
    
    compound ? compounds.push(compound) : compound
  }
  
  if (roi !== Infinity && roi !== 0 && roi !== -Infinity && SeigManager_CONTRACT) {
    // value which title is 'Average APR' in stakingInfo
    const apr = roi

    const commissionRate = await SeigManager_CONTRACT.commissionRates(data.candidateContract);
    const commission = Number(commissionRate.toString()) / 1e27

    //@ts-ignore
    const convertedAPR = apr === 0 ? 0.35 : Number(apr) / 100
    const numOfCompounds = compounds.length === 0 ? 1 : compounds.length
    const expectedAPR = (1 + convertedAPR * (1 - Number(commission)) / numOfCompounds) ** numOfCompounds - 1
    
    return (expectedAPR * 100).toLocaleString(undefined, {maximumFractionDigits: 2, minimumFractionDigits: 2});
  }
  
  
  return '0.00'
}