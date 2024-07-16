import { Flex } from "@chakra-ui/react"
import { useState } from "react"
import { WithdrawType } from "../modal/withdraw/WithdrawType"
import Image from 'next/image'
import TITAN from '@/assets/images/titan_symbol.svg'
import ETHEREUM from '@/assets/images/ethereum_symbol.svg'

type MobileWithdrawProps = {

}

export function MobileWithdraw (args: MobileWithdrawProps) {
  const {} = args

  const [type, setType] = useState('main')

  return (
    <Flex>
      {
        type === 'main' ?
        <Flex flexDir={'column'} justifyContent={'space-between'} alignItems={'space-between'} mt={'30px'} w={'100%'}>
          <WithdrawType 
            name={'Withdraw to Ethereum'}
            content={'Staked TON can be unstaked and can be withdrawn after 93,046 blocks from unstaking (~14 days).'}
            src={ETHEREUM}
            onClick={() => setType('ethereum')}
          />
          {
            
            <WithdrawType 
              name={'Withdraw to Titan'}
              content={'Instead of withdrawing to Ethereum, staked TON can be withdrawn to this layer as TON. By withdrawing to this layer, TON can be used right away without needing to wait for 14 days.'}
              src={TITAN}
              onClick={() => setType('titan')}
            /> 
          }
        </Flex> :
        type === 'ethereum' ?
        '' :
        type === 'titan' ?
        '' : ''

      }
    </Flex>
  )
}