import useCallContract from '@/hooks/useCallContract';
import { useEffect, useState } from 'react';
import Coinage from "services/abi/AutoRefactorCoinage.json"
import Candidate from "services/abi/Candidate.json"
import { useWeb3React } from '@web3-react/core';
import { toBN } from 'web3-utils';
import BN from 'bn.js';
import { calculateExpectedSeig } from '@/utils/getExpectedSeig';
import CONTRACT_ADDRESS from "services/addresses/contract";
import { getContract } from '@/components/getContract';

export function useExpectedSeig (candidateContract: string) {
  const { account, library } = useWeb3React()
  const [expectedSeig, setExpectedSeig] = useState('')


  const { TON_CONTRACT, WTON_CONTRACT, DepositManager_CONTRACT, SeigManager_CONTRACT } = useCallContract();
  
  useEffect(() => {
    async function fetch () {
      const blockNumber = library && await library.getBlockNumber();
      if (
        SeigManager_CONTRACT && 
        TON_CONTRACT && 
        WTON_CONTRACT && 
        DepositManager_CONTRACT &&
        account
      ) {
        const Tot = getContract(await SeigManager_CONTRACT.tot(), Coinage, library, account)
        const coinage = getContract(await SeigManager_CONTRACT.coinages(candidateContract), Coinage, library, account)
        const fromBlockNumber = await SeigManager_CONTRACT.lastCommitBlock(candidateContract)
        const userStaked = await coinage.balanceOf(account)

        const tonTotalSupply = await TON_CONTRACT.totalSupply();
        const totTotalSupply = await Tot.totalSupply()
        const tonBalanceOfWTON = await TON_CONTRACT.balanceOf(CONTRACT_ADDRESS.WTON_ADDRESS)
        const relativeSeigRate = await SeigManager_CONTRACT.relativeSeigRate()
        const tos = toBN(tonTotalSupply)
            .mul(toBN('1000000000'))
            .add(toBN(totTotalSupply))
            .sub(toBN(tonBalanceOfWTON));
        const expectedSeig = calculateExpectedSeig(
            new BN(fromBlockNumber.toString()),
            new BN(blockNumber),
            new BN(userStaked.toString()),
            new BN(totTotalSupply.toString()),
            new BN(tos),
            new BN(relativeSeigRate.toString())
        );
        setExpectedSeig(expectedSeig.toString())
      }
    }
    fetch ()
  })
  return expectedSeig
}