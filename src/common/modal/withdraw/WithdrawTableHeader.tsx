import { chakra, Checkbox, Flex, useCheckbox } from "@chakra-ui/react";
import { FC, useEffect } from "react";
import { getColumnWidthWithdraw } from '@/utils/getColumnWidth';
import TICK from '@/assets/images/Tick.svg'
import Image from "next/image";
import { useEagerConnect } from "@/hooks/useWeb3";

type WithdrawTableHeaderProps = {
  props: any
  toggle: string
  setValue: any
  all: any
}

export const WithdrawTableHeader: FC<WithdrawTableHeaderProps> = ({
  props,
  toggle,
  setValue,
  all
}) => {
  const { state, getCheckboxProps, getInputProps, getLabelProps, htmlProps } = useCheckbox(props)
  useEffect(() => {
    if (all) state.isChecked === true ? setValue(all) : setValue([])
  }, [state.isChecked])

  return  (
    <chakra.thead
      borderBottom={'1px solid #f4f6f8'}
      // mr={'30px'}
      w={'100%'}
      h={'40px'}
      alignItems={'center'}
      justifyContent={'center'}
      mb={'10px'}
    >
      <chakra.tr 
        fontSize={'11px'}
        fontWeight={500}
        color={'#808992'}
        h={'40px'}
      >
        {/* <chakra.th
          w={getColumnWidthWithdraw('checkbox')}
        >
          <chakra.label
            display='flex'
            flexDirection='row'
            alignItems='center'
            pl={'10px'}
            cursor='pointer'
            {...htmlProps}
          >
            <input {...getInputProps()} disabled={toggle === 'Withdraw'} />
            <Flex
              alignItems='center'
              justifyContent='center'
              border='1px solid'
              borderRadius={'4px'}
              borderColor='#e7ebf2'
              bgColor={'#e9edf1'}
              w={'18px'}
              h={'18px'}
              {...getCheckboxProps()}
            >
              {state.isChecked && <Image src={TICK} alt={''} />}
            </Flex>
          </chakra.label>
        </chakra.th> */}
        <chakra.th
          w={getColumnWidthWithdraw('amount')}
        >
          Amount 
          {/* <span 
            style={{
              color:'#2a72e5', 
              margin: '3px'
            }}
          >
            TON
          </span> */}
        </chakra.th>
        <chakra.th
          w={getColumnWidthWithdraw('status')}
        >
          Status
        </chakra.th>
      </chakra.tr>
    </chakra.thead>
  )
}

export default WithdrawTableHeader

const HeaderColumn = (columnName: string) => {
  return (
    <chakra.th
      // w={}
      textAlign={columnName === 'Account' || columnName === 'TX Hash'? 'left' : 'center'}
    >
      {
         
      }
    </chakra.th>
  )
}