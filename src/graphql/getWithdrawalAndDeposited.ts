import { gql } from "@apollo/client";

export const GET_WITHDRAWAL_AND_DEPOSITED = gql`
  query GetWithdrawalAndDeposited($is: String) {
    withdrawalAndDepositeds(orderBy: timestamp, orderDirection: desc) {
      id
      amount
      timestamp
      eventName
      sender
      
      candidate {
        id
      }
    }
  }
`