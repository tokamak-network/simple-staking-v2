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
