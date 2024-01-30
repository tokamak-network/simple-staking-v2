import { Flex, Text, Link } from "@chakra-ui/react"
import { FC, useEffect, useState } from "react";
import { useCallback } from 'react';
import Candidate from "services/abi/Candidate.json"
import { getContract } from '../../../utils/getContract';
import { useWeb3React } from '@web3-react/core';
import { useRecoilState } from "recoil";
import { txState } from "@/atom/global/transaction";

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
        title === 'Unclaimed Staking Reward' && !minimumAmount && contractInfo === '0x36101b31e74c5e8f9a9cec378407bbb776287761' ?
        <Text
          fontSize={'11px'}
          color={'#ff2d78'}
          mt={'3px'}
          w={'250px'}
        >
          <Link
            isExternal
            href={'https://etherscan.io/address/0xcc2f386adca481a00d614d5aa77a30984f264a07'}
            color={'#2a72e5'}
            textDecor={'underline'}
            mr={'3px'}
          >
            Operator
          </Link>  
          must stake at least 
          <Link
            isExternal
            href={'https://medium.com/onther-tech/staking-on-tokamak-network-a5cca48bea3d#:~:text=Become%20a%20direct%20Operator%20in%20the%20Tokamak%20Network%20by%20operating%20a%20new%20blockchain.%20In%20order%20to%20operate%20a%20chain%2C%20at%20least%201%2C000.1%20TON%20must%20be%20deposited%20(posting%20updated%20on%202024.1.22)'}
            mx={'3px'}
            color={'#2a72e5'}
            textDecor={'underline'}
          >
            1,000.1 TON 
          </Link>
          for stakers to receive a staking reward. This operator is managed by 
          <Link
            isExternal
            href={'https://talken.io/'}
            color={'#2a72e5'}
            textDecor={'underline'}
            ml={'3px'}
          >
            Talken.
          </Link>
        </Text> 
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