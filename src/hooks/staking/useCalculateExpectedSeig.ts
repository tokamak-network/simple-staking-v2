import { BigNumber } from 'ethers'
import useCallContract from '@/hooks/useCallContract';
import { useEffect, useState } from 'react';
import Coinage from "services/abi/AutoRefactorCoinage.json"
import RefactorCoinageSnapshotABI from "services/abi/RefactorCoinageSnapshot.json"
import { useWeb3React } from '@web3-react/core';
import CONTRACT_ADDRESS from "services/addresses/contract";
import { getContract } from '@/components/getContract';
import { ethers } from 'ethers';
import { useRecoilState } from 'recoil';
import { txState } from '@/atom/global/transaction';

const RAYDIFF = ethers.BigNumber.from("1"+"0".repeat(9))
const RAY = ethers.BigNumber.from("1"+"0".repeat(27))
const REFACTOR_DIVIDER = BigNumber.from("2");
const REFACTOR_BOUNDARY = BigNumber.from("1"+"0".repeat(28));

export function useExpectedSeig (candidateContract: string, stakedAmount: string, candidate: string) {
  const { account, library } = useWeb3React()
  const [expectedSeig, setExpectedSeig] = useState('')
  const [seigOfLayer, setSeigOfLayer] = useState('')
  const [txPending, setTxPending] = useRecoilState(txState);


  const { TON_CONTRACT, WTON_CONTRACT, DepositManager_CONTRACT, SeigManager_CONTRACT } = useCallContract();
  
  useEffect(() => {
    async function fetch () {
      const blockNumber = library && await library.getBlockNumber();
      if (
        SeigManager_CONTRACT && 
        TON_CONTRACT && 
        WTON_CONTRACT && 
        DepositManager_CONTRACT &&
        account &&
        candidateContract
      ) {
        try {
          const Tot = getContract(await SeigManager_CONTRACT.tot(), RefactorCoinageSnapshotABI, library, account)
          const coinage = getContract(await SeigManager_CONTRACT.coinages(candidateContract), Coinage, library, account)
          // const fromBlockNumber = await SeigManager_CONTRACT.lastCommitBlock(candidateContract)
          const userStaked = await coinage.balanceOf(account)
  
          const tonTotalSupply = await TON_CONTRACT.totalSupply();
          const totTotalSupply = await Tot.totalSupply()
          const tonBalanceOfWTON = await TON_CONTRACT.balanceOf(CONTRACT_ADDRESS.WTON_ADDRESS)
          const tonBalanceOfZero = await TON_CONTRACT.balanceOf(ethers.constants.AddressZero)
          const tonBalanceOfOne = await TON_CONTRACT.balanceOf('0x0000000000000000000000000000000000000001')
          
          const lastSeigBlock = await SeigManager_CONTRACT.lastSeigBlock()
          const seigPerBlock = await SeigManager_CONTRACT.seigPerBlock()
          const relativeSeigRate = await SeigManager_CONTRACT.relativeSeigRate()
          
          let tos = (tonTotalSupply.sub(tonBalanceOfWTON).sub(tonBalanceOfZero).sub(tonBalanceOfOne)).mul(RAYDIFF).add(totTotalSupply)

          const totFactor = await Tot.factor()
          const totBalanceAndFactor = await Tot.getBalanceAndFactor(candidateContract)

          let coinageTotalSupply = await coinage.totalSupply()
          let maxSeig = await calcMaxSeigs(lastSeigBlock, seigPerBlock, blockNumber)
          let stakedSeig1 = maxSeig.mul(totTotalSupply).div(BigNumber.from(tos.toString()))
          let unstakedSeig = maxSeig.sub(stakedSeig1)
          let stakedSeig = stakedSeig1.add(unstakedSeig.mul(relativeSeigRate).div(RAY))

          let nextTotTotalSupply = totTotalSupply.add(stakedSeig);
          let newTotFactor = await calcNewFactor (totTotalSupply, nextTotTotalSupply, totFactor)
          let newFactorSet = await setFactor(newTotFactor)
          let nextBalanceOfLayerInTot = await applyFactor(newFactorSet?.factor, newFactorSet?.refactorCount, totBalanceAndFactor[0].balance, totBalanceAndFactor[0].refactoredCount)

          let commissionRates = await SeigManager_CONTRACT.commissionRates(candidateContract)
          
          let isCommissionRateNegative = await SeigManager_CONTRACT.isCommissionRateNegative(candidateContract)

          let seigOfLayer = nextBalanceOfLayerInTot.sub(coinageTotalSupply)
          let operatorSeigs = ethers.constants.Zero
          
          let seig
          
          if (commissionRates.toString() != ethers.constants.Zero) {
            if (!isCommissionRateNegative) {
              operatorSeigs = seigOfLayer.mul(commissionRates).div(RAY)
              const restSeigs = seigOfLayer.sub(operatorSeigs)
              const userSeig = restSeigs.mul(BigNumber.from(userStaked)).div(BigNumber.from(stakedAmount))
              seig = candidate === account ? userSeig.add(operatorSeigs) : userSeig
            } 
          } else {
            seig = stakedAmount === '0' ? 0 : seigOfLayer.mul(BigNumber.from(userStaked)).div(BigNumber.from(stakedAmount))
          }
          // console.log(seigOfLayer)
          setSeigOfLayer(seigOfLayer.toString())
          setExpectedSeig(seig.toString())
        } catch (e) {
          console.log(e)
        }
      }
    }
    fetch ()
  }, [account, candidateContract, txPending])
  return { expectedSeig, seigOfLayer }
}

const calcMaxSeigs = async  (lastSeigBlock: any, seigPerBlock: any, blockNumber: number) => {
  let span = blockNumber - lastSeigBlock.toNumber()
  return seigPerBlock.mul(ethers.BigNumber.from(""+span))
}

const calcNewFactor = async (prevTotal: any, nxtTotal: any, oldFactor: any) => {
  return nxtTotal.mul(oldFactor).div(prevTotal)
}

const applyFactor = async (factor: any, refactorCount: any, balance: any, refactoredCount: any) => {

  let v = balance.mul(factor).div(RAY)
  v = v.mul(REFACTOR_DIVIDER.pow(refactorCount.sub(refactoredCount)))
  return v
}

const setFactor = async (factor_: any) => {
  let count = 0;
  let f = factor_;

  for (; f.gte(REFACTOR_BOUNDARY); f = f.div(REFACTOR_DIVIDER)) {
      count++;
  }
  return {factor: f, refactorCount: BigNumber.from(''+count)}
}