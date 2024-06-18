import { Flex } from "@chakra-ui/react"
import { useState } from "react"
import TON from "@/assets/images/ton.svg"
import Image from "next/image"
import { BalanceInput } from "@/common/input/CustomInput"
import { Unstake } from "./Unstake"
import { WithdrawToEthereum } from "./WithdrawToEthereum"

type ToEthereumProps = {

}

export const ToEthereum = (args: ToEthereumProps) => {
  const {} = args

  const [tab, setTab] = useState('unstake')

  return (
    <Flex justifyContent={'center'} flexDir={'column'} alignItems={'center'}>
      <Flex
        w={'213px'}
        h={'30px'}
        p={'3px'}
        border={'solid 1px #e7ebf2'}
        borderRadius={'5px'}
        fontSize={'12px'}
        fontWeight={'normal'}
        mt={'24px'}
        mb={'21px'}
        justifyContent={'space-between'}
      >
        <Flex
          w={'102px'}
          textAlign={'center'}
          borderRadius={'5px'}
          color={tab === 'unstake' ? '#fff' : ''}
          bg={tab==="unstake" ? '#2a72e5' : '#fff'}
          justifyContent={'center'}
          alignItems={'center'}
          onClick={() => setTab('unstake')}
          cursor={'pointer'}
        >
          Unstake
        </Flex>
        <Flex
          w={'102px'}
          textAlign={'center'}
          borderRadius={'5px'}
          color={tab === 'withdraw' ? '#fff' : ''}
          bg={tab === "withdraw" ? '#2a72e5' : '#fff'}
          justifyContent={'center'}
          alignItems={'center'}
          onClick={() => setTab('withdraw')}
          cursor={'pointer'}
        >
          Withdraw
        </Flex>
      </Flex>
      {
        tab === 'unstake' ?
        <Unstake />:
        <WithdrawToEthereum />
      }
    </Flex>
  )
}