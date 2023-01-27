export function getColumnWidthStaking(tableType: string, columnName: string) {

  return tableType === 'Staking' && (columnName === 'Account' || columnName === 'account') ? '110px' :
    columnName === 'TX Hash' || columnName === 'txHash' ? '110px' :
      tableType === 'Staking' && (columnName === 'Type' || columnName === 'txType') ? '80px' :
        tableType === 'Staking' && (columnName === 'Amount' || columnName === 'amount') ? '150px' :
          columnName === 'Time' || columnName === 'date' ? '175px' : ''
}

export function getColumnWidthWallet(columnName: string) {
  return columnName === 'index' ? '70px' :
    columnName === 'txHash' || columnName === 'contractAddress' ? '200px' :
      columnName === 'txType' || columnName === 'amount' ? '160px' :
        columnName === 'blockNumber' ? '180px' :
          columnName === 'status' ? '140px' : ''
}

export function getColumnWidthWalletMobile(columnName: string) {
  return columnName === 'txHash' ? '27.8%' :
    columnName === 'txType' ? '22.2%' : columnName === 'amount' ? '25%' :

      columnName === 'status' ? '13.9%' : ''
}