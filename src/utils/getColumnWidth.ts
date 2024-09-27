export function getColumnWidthStaking(tableType: string, columnName: string) {

  return tableType === 'Staking' && (columnName === 'Account' || columnName === 'account') ? '110px' :
    columnName === 'TX Hash' || columnName === 'txHash' ? '110px' :
      tableType === 'Staking' && (columnName === 'Type' || columnName === 'txType') ? '80px' :
        tableType === 'Staking' && (columnName === 'Amount' || columnName === 'amount') ? '150px' :
          columnName === 'Time' || columnName === 'date' ? '175px' : ''
}

export function getColumnWidthWallet(columnName: string) {
  return columnName === 'index' ? '70px' :
    columnName === 'txHash' || columnName === 'contractAddress' ? '140px' :
      columnName === 'txType' || columnName === 'amount' ? '130px' :
        columnName === 'blockNumber' ? '360px' : ''
}

export function getColumnWidthWalletMobile(columnName: string) {
  return columnName === 'txHash' ? '33.2%' :
    columnName === 'txType' ? '26.2%' : 
    columnName === 'amount' ? '30%' :
    columnName === 'status' ? '13.9%' : ''
}

export function getColumnWidthWithdraw (columnName: string) {
  return columnName === 'amount' ? '180px' :
    columnName === 'status' ? '140px' : ''
}