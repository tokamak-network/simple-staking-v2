import { Flex, useDisclosure } from "@chakra-ui/react"
import { useCallback, useState } from "react"
import { WithdrawType } from "../../../../common/modal/withdraw/WithdrawType"
import TITAN from '@/assets/images/titan_symbol.svg'
import ETHEREUM from '@/assets/images/ethereum_symbol.svg'
import { WithdrawDrawer } from "./WithdrawDrawer"
import { SelectOperator } from "./components/SelectOperators"
import { convertNumber } from "@/components/number"
import { UnstakableBalance } from "@/common/balance/UnstakableBalance"

type MobileWithdrawProps = {
  operatorList: any
}

export function MobileWithdraw (args: MobileWithdrawProps) {
  const { operatorList } = args
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [type, setType] = useState('')
  const [selectedOp, setSelectedOp] = useState<any>(undefined);

  const openDrawer = (type: string) => {
    onOpen()
    setType(type)
  }

  const staked = selectedOp?.stakeOf ?
    convertNumber({
      amount: selectedOp?.stakeOf,
      type: 'ray',
      localeString: true
    }) : '0.00'
    
  return (
    <Flex>
      <Flex flexDir={'column'} justifyContent={'space-between'} alignItems={'space-between'} mt={'20px'} w={'100%'}>
        <Flex 
          px={'20px'}
          py={'5px'}
          w={'100%'}
          borderRadius={'10px'}
          border={'solid 1px #e7ebf2'}
          bg={'#fff'}
          flexDir={'column'}
          mb={'15px'}
        >
          <SelectOperator
            operatorList={operatorList}
            selectedOp={selectedOp}
            onOpen={onOpen}
            setSelectedOp={setSelectedOp}
          />
          <UnstakableBalance 
            stakedAmount={staked}
            justify={'start'}
          />
        </Flex>
        {
          selectedOp && selectedOp.candidateAddOn !== null ?
          <Flex flexDir={'column'}>
            <WithdrawType 
              name={'Withdraw to Ethereum'}
              content={'Staked TON can be unstaked and can be withdrawn after 93,046 blocks from unstaking (~14 days).'}
              src={ETHEREUM}
              onClick={() => openDrawer('Ethereum')}
            /> 
            <WithdrawType 
              name={'Withdraw to Titan'}
              content={'Instead of withdrawing to Ethereum, staked TON can be withdrawn to this layer as TON. By withdrawing to this layer, TON can be used right away without needing to wait for 14 days.'}
              src={TITAN}
              onClick={() => openDrawer('Titan')}
            />
          </Flex>
          : selectedOp ?
          <WithdrawType 
            name={'Withdraw to Ethereum'}
            content={'Staked TON can be unstaked and can be withdrawn after 93,046 blocks from unstaking (~14 days).'}
            src={ETHEREUM}
            onClick={() => openDrawer('Ethereum')}
          />  : ''
          
        }
      </Flex>
      <WithdrawDrawer 
        onClose={onClose}
        isOpen={isOpen}
        type={type}
        selectedOp={selectedOp}
      />
    </Flex>
  )
}

export default MobileWithdraw