import { chakra } from "@chakra-ui/react";
import { FC } from "react";
import { getColumnWidth } from '../../../../utils/getColumnWidth';

type HistoryTableHeaderProps = {
  tableType: string
}

export const HistoryTableHeader: FC<HistoryTableHeaderProps> = ({
  tableType
}) => {
  return  (
    <chakra.thead
        borderBottom={'1px dashed #e6eaee'}
        // mr={'30px'}
        w={'100%'}
        h={'40px'}
        alignItems={'center'}
        justifyContent={'center'}
      >
        <chakra.tr 
          fontSize={'13px'}
          color={'#808992'}
          h={'40px'}
        >
          { HeaderColumn(tableType, 'Account') }
          { HeaderColumn(tableType, 'TX Hash') }
          { HeaderColumn(tableType, 'Type') }
          { HeaderColumn(tableType, 'Amount') }
          { HeaderColumn(tableType, 'Time') }
        </chakra.tr>
      </chakra.thead>
  )
}

const HeaderColumn = (tableType: string, columnName: string) => {
  return (
    <chakra.th
      w={ getColumnWidth(tableType, columnName) }
      textAlign={columnName === 'Account' || columnName === 'TX Hash'? 'left' : 'center'}
    >
      {
        tableType === 'Staking' && columnName === 'Account' ? 'Account' :
        columnName === 'TX Hash' ? 'TX Hash' :
        tableType === 'Staking' && columnName === 'Type' ? 'Type' :
        tableType === 'Staking' && columnName === 'Amount' ? 'Amount' :
        columnName === 'Time' ? 'Time' : ''
      }
    </chakra.th>
  )
}