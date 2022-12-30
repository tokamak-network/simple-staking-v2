import { chakra } from "@chakra-ui/react";
import { FC } from "react";
import { getColumnWidthWallet } from '@/utils/getColumnWidth';

type TableHeaderProps = {

}

export const TableHeader: FC<TableHeaderProps> = ({

}) => {
  return  (
    <chakra.thead
        borderBottom={'1px dashed #e6eaee'}
        // mr={'30px'}
        w={'1110px'}
        h={'40px'}
        alignItems={'center'}
        justifyContent={'center'}
      >
        <chakra.tr 
          fontSize={'13px'}
          color={'#808992'}
          h={'40px'}
        >
          { HeaderColumn('index') }
          { HeaderColumn('txHash') }
          { HeaderColumn('contractAddress') }
          { HeaderColumn('txType') }
          { HeaderColumn('amount') }
          { HeaderColumn('blockNumber') }
          { HeaderColumn('status') }
        </chakra.tr>
      </chakra.thead>
  )
}

const HeaderColumn = ( columnName: string) => {
  return (
    <chakra.th
      w={ getColumnWidthWallet(columnName) }
      textAlign={columnName === 'Account' || columnName === 'TX Hash'? 'left' : 'center'}
    >
      {
        columnName === 'index' ? '#' :
        columnName === 'txHash' ? 'Transaction Hash' : 
        columnName === 'contractAddress' ? 'Operator Contract' :
        columnName === 'txType' ? 'Type' : 
        columnName === 'amount' ? 'Amount' :
        columnName === 'blockNumber' ? 'Block Number' :
        columnName === 'status' ? 'Status' : ''
      }
    </chakra.th>
  )
}