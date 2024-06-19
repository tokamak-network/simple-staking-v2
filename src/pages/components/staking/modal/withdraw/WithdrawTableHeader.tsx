import { chakra, Checkbox, Flex } from "@chakra-ui/react";
import { FC } from "react";
import { getColumnWidthWithdraw } from '@/utils/getColumnWidth';

type WithdrawTableHeaderProps = {
 
}

export const WithdrawTableHeader: FC<WithdrawTableHeaderProps> = ({
 
}) => {
  
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
        <chakra.th
          w={getColumnWidthWithdraw('checkbox')}
        >
          <Checkbox
            bgColor={'#e9edf1'} 
            borderRadius={'4px'} 
            border={'solid 1px #e7ebf2'} 
            w={'18px'}
            h={'18px'}
          />
        </chakra.th>
        <chakra.th
          w={getColumnWidthWithdraw('amount')}
        >
          Amount 
          <span 
            style={{
              color:'#2a72e5', 
              margin: '3px'
            }}
          >
            TON
          </span>
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