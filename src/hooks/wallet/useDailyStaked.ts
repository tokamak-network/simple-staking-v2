import { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { getDepositTotal } from '@/api';


export function useDailyStaked() {
    const [dailyStakedAmnts, setDailyStakedAmnts] = useState([]);
    const { account } = useWeb3React();

    useEffect(() => {
        async function fetchData() {
            if (account) {
                const data = await getDepositTotal(account.toLowerCase());
                if (data.length !== 0) {
                    setDailyStakedAmnts(data)
                }
            }
        }
        fetchData()
    }, [account])

    return { dailyStakedAmnts }
}