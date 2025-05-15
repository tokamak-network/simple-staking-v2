import { Flex } from "@chakra-ui/react"
import { useState } from "react"
import { Unstake } from "./Unstake"
import { WithdrawToEthereum } from "./WithdrawToEthereum"
import { StakeModalDataType } from '@/types/index';
import { WithdrawTypeSelector } from "@/common/selector/WithdrawType"

type ToEthereumProps = { 
  selectedModalData: StakeModalDataType
  closeThisModal: any
}

export const ToEthereum = (args: ToEthereumProps) => {
  const {selectedModalData, closeThisModal} = args

  const [tab, setTab] = useState('unstake')

  return (
    <Flex justifyContent={'center'} flexDir={'column'} alignItems={'center'}>
      <WithdrawTypeSelector 
        tab={tab}
        setTab={setTab}
      />
      {
        tab === 'unstake' ?
        <Unstake 
          selectedModalData={selectedModalData}
          closeThisModal={closeThisModal}
        />:
        <WithdrawToEthereum 
          selectedModalData={selectedModalData}
          closeThisModal={closeThisModal}
          type={'Withdraw'}
        />
      }
    </Flex>
  )
}