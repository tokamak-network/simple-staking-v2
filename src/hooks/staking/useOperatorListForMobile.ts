import { getEventByLayer2, getOperatorsInfo, getDelegators, getCandidateCreateEvent, getOperatorUserHistory, getCandidates } from "@/api";
import { useEffect, useState } from 'react';
import { NON_CANDIDATE } from "@/constants";
import { useWeb3React } from '@web3-react/core';
import { convertNumber } from '@/utils/number';
import useCallContract from '@/hooks/useCallContract';
import { BigNumber } from 'ethers';
import { calculateExpectedSeig } from "tokamak-staking-lib";
import { toBN } from 'web3-utils';
import useContract from "hooks/useContract";
import AutoRefactorCoinageABI from 'services/abi/AutoRefactorCoinage.json';
import Layer2ABI from 'services/abi/Layer2.json'
import { getContract } from "utils/getContract";
import CONTRACT_ADDRESS from "services/addresses/contract";
import { BASE_PROVIDER } from "@/constants";
import { range } from 'lodash'
import BN from 'bn.js';
import { useRecoilValue } from 'recoil';
import { txState } from '@/atom/global/transaction';
import { useWindowDimensions } from "../useWindowDimensions";
import useOperatorList from "./useOperatorList";


export function useOperatorListForMobile() {
    const [operatorListM, setOperatorListM] = useState<any[]>([]);
    const { operatorList } = useOperatorList();
    const { account, library } = useWeb3React();
    const { DepositManager_CONTRACT, SeigManager_CONTRACT, TON_CONTRACT, WTON_CONTRACT } = useCallContract();
    const { WTON_ADDRESS } = CONTRACT_ADDRESS;
    const tx = useRecoilValue(txState)

    useEffect(() => {
        async function fetchList() {            
                const operators = await Promise.all(operatorList.map(async (obj: any) => {
                    const blockNumber = library && await library.getBlockNumber();
                    const candidates = await getCandidates()
                    const events = await getCandidateCreateEvent();
                    const candidateContractCreated = events.filter(
                        (event: any) => event.eventName === 'CandidateContractCreated'
                    );

                    const isCandidate = candidates.find(
                        (candidate: any) => candidate.layer2 === obj.layer2.toLowerCase()
                    );

                    let deployedAt;
                    let seigniorage;
                    let delayedCommissionRateNegative;
                    let delayedCommissionRate;
                    let delayedCommissionBlock;
                    let withdrawalDelay;
                    let globalWithdrawalDelay;

                    if (account && SeigManager_CONTRACT && TON_CONTRACT && DepositManager_CONTRACT) {
                        const Tot = getContract(await SeigManager_CONTRACT.tot(), AutoRefactorCoinageABI, library, account)
                        const coinage = getContract(await SeigManager_CONTRACT.coinages(obj.layer2), AutoRefactorCoinageABI, library, account)
                        const Layer2 = getContract(obj.layer2, Layer2ABI, library)
                        const userStaked = await coinage.balanceOf(account)

                        const tonTotalSupply = await TON_CONTRACT.totalSupply();
                        const totTotalSupply = await Tot.totalSupply()
                        const tonBalanceOfWTON = await TON_CONTRACT.balanceOf(WTON_ADDRESS)
                        const relativeSeigRate = await SeigManager_CONTRACT.relativeSeigRate()
                        const tos = toBN(tonTotalSupply)
                            .mul(toBN('1000000000'))
                            .add(toBN(totTotalSupply))
                            .sub(toBN(tonBalanceOfWTON));
                        const fromBlockNumber = await SeigManager_CONTRACT.lastCommitBlock(obj.layer2)
                        seigniorage = calculateExpectedSeig(
                            new BN(fromBlockNumber.toString()),
                            new BN(blockNumber),
                            new BN(userStaked.toString()),
                            new BN(totTotalSupply.toString()),
                            new BN(tos),
                            new BN(relativeSeigRate.toString())
                        );

                        if (isCandidate.kind === 'candidate' || isCandidate.layer2 === '0x2000fc16911fc044130c29c1aa49d3e0b101716a') {
                            const candi = candidateContractCreated.filter(
                                (candidate: any) =>
                                    candidate.data.candidateContract.toLowerCase() === obj.layer2.toLowerCase()
                            );
                            const block = library && await library.getBlock(candi[0]?.txInfo.blockNumber);
                            deployedAt = block ? block.timestamp : 0;
                        }
                        else if (isCandidate.kind !== 'candidate' ||
                            isCandidate.kind === '' ||
                            isCandidate.kind === 'layer2') {
                            const [firstEpoch] = await Promise.all([
                                Layer2.getEpoch(0, 0),
                            ]);
                            deployedAt = firstEpoch.timestamp.toString();
                        }

                        delayedCommissionRate = await SeigManager_CONTRACT.delayedCommissionRate(obj.layer2);
                        delayedCommissionRateNegative = await SeigManager_CONTRACT.delayedCommissionRateNegative(obj.layer2);
                        delayedCommissionBlock = await SeigManager_CONTRACT.delayedCommissionBlock(obj.layer2);
                        withdrawalDelay = await DepositManager_CONTRACT.withdrawalDelay(obj.layer2)
                        globalWithdrawalDelay = await DepositManager_CONTRACT.globalWithdrawalDelay()

                    }
                    const fetchedData = {
                        ...obj,
                        userSeigs: seigniorage, //mobile
                        deployedAt: deployedAt, //mobile
                        delayedCommissionRateNegative: delayedCommissionRateNegative, //mobile
                        delayedCommissionRate: convertNumber({
                            amount: delayedCommissionRate?.toString(),
                            type: 'wei',
                        }), //mobile
                        delayedCommissionBlock: delayedCommissionBlock, //mobile
                        withdrawalDelay: withdrawalDelay, //mobile
                        globalWithdrawalDelay: globalWithdrawalDelay, //mobile
                    }

                    return await fetchedData

                }))
                setOperatorListM(operators)
            }
        
        fetchList()
    }, [DepositManager_CONTRACT, SeigManager_CONTRACT, account,operatorList])
    return operatorListM
}


export default useOperatorListForMobile;