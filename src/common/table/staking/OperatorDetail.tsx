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
        title === 'Unclaimed Staking Reward' && !minimumAmount && account ?
          (
            <Text
              fontSize={'11px'}
              color={'#3e495c'}
              mt={'3px'}
              w={'215px'}
              textAlign={'left'}
              // w={'250px'}
            >
            <span style={{color:'#ff2d78'}}>Warning</span>
            : operator have not met the minimum staked balance requirement (at least 1,000.1 TON). As a result, there will be 
            <span style={{color:'#2a72e5'}}> no staking reward </span> 
            for staking on this layer2.
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