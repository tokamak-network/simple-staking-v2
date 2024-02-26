import { Flex, Text, Link } from "@chakra-ui/react"
import { FC, useEffect, useState } from "react";
import { useCallback } from 'react';
import Candidate from "services/abi/Candidate.json"
import { getContract } from '../../../utils/getContract';
import { useWeb3React } from '@web3-react/core';
import { useRecoilState, useRecoilValue } from 'recoil';
import { txState } from "@/atom/global/transaction";
import { minimumAmountState } from '@/atom/staking/minimumAmount';

type OperatorDetailProps = {
  title: string; 
  value: string | number | undefined; 
  unit?: string; 
  type?: string;
  contractInfo?: any;
  minimumAmount?: boolean;
}

export const OperatorDetailInfo: FC<OperatorDetailProps> = ({
  title,
  value,
  unit,
  type,
  contractInfo,
  minimumAmount
}) => {
  const { library, account } = useWeb3React()
  const [tx, setTx] = useState();
  const [txPending, setTxPending] = useRecoilState(txState);
  const minimum = useRecoilValue(minimumAmountState)
  const updateSeig = useCallback(async () => {
    if (account && library) {
      const Candidate_CONTRACT = getContract(contractInfo, Candidate.abi, library, account)
      const tx = await Candidate_CONTRACT.updateSeigniorage()
      setTx(tx);
      setTxPending(true);
    }
  }, [])

  useEffect(() => {
    async function waitReceipt() {
      if (tx && !tx['status']) {
        //@ts-ignore
        await tx.wait().then((receipt: any) => {
          if (receipt.status) {
            setTxPending(false);
            setTx(undefined);
          }
        });
      }
    }
    waitReceipt();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tx]);

  return (
    <Flex
      flexDir={'column'}
    >
      <Text 
        color={'#808992'}
        fontSize={'15px'} 
        mb={'12px'}
      >
        {title}
      </Text>
      <Flex flexDir={'row'} alignItems={type === 'date' ? 'start' : 'end'} h={'37px'}>
        <Text 
          fontSize={type === 'date' ? '16px' : '28px'}
          fontWeight={type === 'date' ? 500 : 'bold'}
          color={'#304156'}
        >
          {title === 'Unclaimed Staking Reward' && !minimumAmount ? '-' : value}
        </Text>
        {
          unit ? 
          <Text 
            fontSize={'13px'} 
            fontWeight={500} 
            ml={'6px'} 
            mb={'5px'}
          >
            {unit}
          </Text> :
          ''
        }
      </Flex>
      {
        title === 'Unclaimed Staking Reward' && !minimum && account ?
          (
            <Text
              fontSize={'11px'}
              color={'#ff2d78'}
              mt={'3px'}
              w={'215px'}
              textAlign={'left'}
              // w={'250px'}
            >
            <span style={{color:'#ff2d78'}}>Warning</span>
            : The 
            <Link
              isExternal
              href={`https://etherscan.io/address/${contractInfo}`}
              color={'#2a72e5'}
              mx={'3px'}
            >
            operator
            </Link>
            is required to stake at least
            <Link
              isExternal
              href={'https://medium.com/onther-tech/staking-on-tokamak-network-a5cca48bea3d#:~:text=Become%20a%20direct%20Operator%20in%20the%20Tokamak%20Network%20by%20operating%20a%20new%20blockchain.%20In%20order%20to%20operate%20a%20chain%2C%20at%20least%201%2C000.1%20TON%20must%20be%20deposited%20(posting%20updated%20on%202024.1.22)'}
              color={'#2a72e5'}
              mx={'3px'}
            >
              1,000.1 TON
            </Link>
            on this layer2 before stakers can receive the staking reward. Users are unable to stake until this minimum collateral requirement is fulfilled.
          </Text>
          )
        : title === 'Unclaimed Staking Reward' && 
          value !== '0.00' && 
          account ?
          <Flex
            fontSize={'11px'}
            color={'#2a72e5'}
            cursor={'pointer'}
            mt={'3px'}
            onClick={()=> updateSeig()}
          >
            Add to Your Staked
          </Flex> : 
          ''
      }
    </Flex>
  )
}

export default OperatorDetailInfo