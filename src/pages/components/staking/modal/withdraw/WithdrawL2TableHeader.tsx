import { chakra, Checkbox, Flex } from "@chakra-ui/react";
import { FC } from "react";
import { getColumnWidthWithdraw } from '@/utils/getColumnWidth';

type WithdrawL2TableHeaderProps = {
 
}

export const WithdrawL2TableHeader: FC<WithdrawL2TableHeaderProps> = ({
 
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
        color={'#3e495c'}
        h={'33px'}
      >
        <chakra.th
          w={'160px'}
        >
          Amount 
        </chakra.th>
        <chakra.th
          w={'160px'}
        >
          Status
        </chakra.th>
      </chakra.tr>
    </chakra.thead>
  )
}

export default WithdrawL2TableHeader
