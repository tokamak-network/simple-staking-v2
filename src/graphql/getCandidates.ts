import { orderBy } from 'lodash';
import { gql } from "@apollo/client";

export const GET_CANDIDATE = gql`
  query GetCandidate($id: String) {
    candidates(where:{stakedAmount_gt: 0}, orderBy: stakedAmount, orderDirection: desc) {
      id
      candidate
      candidateContract
      name
      stakedAmount
      commissionRate
      stakedUserList: stakedUserList(first:1000, orderBy:stakedAmount, orderDirection: desc) {
        id
        stakedAmount
      }
      staked: staked(first:1000) {
        id
        amount
        timestamp
        eventName
        sender
        transaction {
          id
        }
      }
      unstaked: unstaked (first:1000) {
        id
        amount
        timestamp
        eventName
        sender
        transaction {
          id
        }
      }
      withdrawal: withdrawal (first:1000) {
        id
        amount
        timestamp
        eventName
        sender
        transaction {
          id
        }
      }
      asCommit: addedSeig (orderBy: timestamp, orderDirection: desc){
        id
        seigs
        layer2
        operatorSeigs
        timestamp
        transaction {
          id
        }
      }
    }
  }
`;

export const GET_MY_STAKED = gql`
  query GetStakedPerLayer($id: String!) {
    userStakeds(where: { id: $id }) {
      id
      stakedAmount
    }
  }
`