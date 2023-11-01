import { convertToRay, convertToWei, floatParser } from '@/utils/number';
import { txState } from '@/atom/global/transaction';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useCallback, useEffect, useState } from 'react';
import { padLeft } from 'web3-utils';
import CONTRACT_ADDRESS from '@/services/addresses/contract';
import { marshalString, unmarshalString } from '@/utils/marshalString';
import { inputBalanceState, inputState } from '@/atom/global/input';


const getData = (layer2: any) => {
    const { DepositManager_ADDRESS } = CONTRACT_ADDRESS;

    if (layer2) return marshalString(
        //@ts-ignore
        [DepositManager_ADDRESS, layer2]
            .map(unmarshalString)
            .map(str => padLeft(str, 64)).join('')
    )
}

export const staking = async (userTonBalance: any, TON_CONTRACT: any, amount: any, layer2: string, setTxPending: any, setTx: any) => {

    const { WTON_ADDRESS } = CONTRACT_ADDRESS;
    if (userTonBalance) {
        const tonBalance = floatParser(userTonBalance)
        if (tonBalance && amount > tonBalance) {
            return alert('Please check input amount.');

        }
        
        // if (confirm('Stake, Unstake, and Restake functionalities are temporarily disabled. Please refer to the posting for more details and check our official Twitter page for updates')) {
        const data = getData(layer2)
        if (TON_CONTRACT && amount) {
            console.log('aaa')
            try {
                console.log('bbb')
                const tx = await TON_CONTRACT.approveAndCall(
                    WTON_ADDRESS,
                    convertToWei(amount.toString()),
                    data
                )
                console.log(tx)
                setTxPending(true)
                setTx(tx)

                if (tx) {
                    await tx.wait().then((receipt: any) => {
                        if (receipt.status) {
                            setTxPending(false);
                            setTx(undefined);
                        }
                    })
                }
            }
            catch (e) {
                setTxPending(false);
                setTx(undefined);
            }

        }
    }
}

export const reStaking = async (account: any, DepositManager_CONTRACT: any, layer2: string, setTxPending: any, setTx: any) => {
    // if (confirm('Stake, Unstake, and Restake functionalities are temporarily disabled. Please refer to the posting for more details and check our official Twitter page for updates')) {
    // }
    if (DepositManager_CONTRACT && account && layer2) {
        try {
            const numPendRequest = await DepositManager_CONTRACT.numRequests(layer2, account)
            const tx = await DepositManager_CONTRACT.redepositMulti(layer2, numPendRequest)
            setTxPending(true)
            setTx(tx)

            if (tx) {
                await tx.wait().then((receipt: any) => {
                    if (receipt.status) {
                        setTxPending(false);
                        setTx(undefined);
                    }
                })
            }
        }
        catch (e) {
            setTxPending(false);
            setTx(undefined);
        }
    }

}

export const unstake = async (account: any, layer2: string, DepositManager_CONTRACT: any, setTxPending: any, setTx: any, amount: number) => {
//   if (confirm('Stake, Unstake, and Restake functionalities are temporarily disabled. Please refer to the posting for more details and check our official Twitter page for updates')) {
//     }
    if (DepositManager_CONTRACT && account && layer2) {

        try {
            const numPendRequest = await DepositManager_CONTRACT.numRequests(layer2, account)
            const tx = await DepositManager_CONTRACT.requestWithdrawal(layer2, convertToRay(amount.toString()))
            setTx(tx);
            setTxPending(true)
            if (tx) {
                await tx.wait().then((receipt: any) => {
                    if (receipt.status) {
                        setTxPending(false);
                        setTx(undefined);
                    }
                })
            }
        }
        catch (e) {
            setTxPending(false);
            setTx(undefined);
        }
    }
}

export const withdraw = async (account: any, layer2: string, DepositManager_CONTRACT: any, withdrawableLength: any, setTxPending: any, setTx: any) => {
    if (DepositManager_CONTRACT && account && layer2) {

        try {
            const tx = await DepositManager_CONTRACT.processRequests(layer2, withdrawableLength, true)
            setTx(tx);
            setTxPending(true)
            if (tx) {
                await tx.wait().then((receipt: any) => {
                    if (receipt.status) {
                        setTxPending(false);
                        setTx(undefined);
                    }
                })
            }
        }
        catch (e) {
            setTxPending(false);
            setTx(undefined);
        }
    }

}
