export function getColumnWidth(tableType: string, columnName: string) {
  return tableType === 'Staking' && (columnName === 'Account' || columnName === 'account') ? '110px' :
  columnName === 'TX Hash' || columnName === 'txHash' ? '110px' :
  tableType === 'Staking' && (columnName === 'Type' || columnName === 'txType') ? '80px' :
  tableType === 'Staking' && (columnName === 'Amount' || columnName === 'amount') ? '150px' :
  columnName === 'Time' || columnName === 'date' ? '175px' : ''
}