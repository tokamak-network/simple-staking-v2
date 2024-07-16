import { WithdrawTypeSelector } from "@/common/selector/WithdrawType"
import { Flex } from "@chakra-ui/react"
import { useState } from "react"
import { MobileUnstake } from "./MobileUnstake"

type MobileToEthereumProps = {
  selectedOp: any
  onClose: any
}

export function MobileToEthereum (args: MobileToEthereumProps) {
  const { selectedOp, onClose } = args
  const [tab, setTab] = useState('unstake')

  return (
    <Flex flexDir={'column'} h={'100%'}>
      <WithdrawTypeSelector 
        tab={tab}
        setTab={setTab}
      />
      {
        tab === 'unstake' ?
        <MobileUnstake 
          selectedOp={selectedOp}
          onClose={onClose}
        /> : 
        ''
      }
    </Flex>
  )
}