import { orderBy } from 'lodash';
import { gql } from "@apollo/client";

export const GET_GRAPH = gql`
  query GetGraph($id: String) {
    stakingDayDatas (first:100, orderBy: date, orderDirection: desc) {
      id
      totalStaked
      date
    }
  }
`;

export const GET_FACTORY = gql`
query GetFactory($id: String) {
  factories(first: 5) {
    id
    totalStaked
    totalPendingWithdrawal
    numOfCandidate
  }
}
`
