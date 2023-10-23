import { gql } from "@apollo/client";

export const GET_CANDIDATE = gql`
  query GetCandidate($id: String) {
    candidates(where:{stakedAmount_gt: 0}) {
      id
      candidate
      candidateContract
      name
      stakedAmount
      commissionRate
      stakedUserList {
        id
        stakedAmount
      }
      staked {
        id
        amount
        timestamp
        eventName
        sender
      }
      unstaked {
        id
        amount
        timestamp
        eventName
        sender
      }
      withdrawal {
        id
        amount
        timestamp
        eventName
        sender
      }
      asCommit: addedSeig (orderBy: timestamp, orderDirection: desc){
        id
        seigs
        layer2
        operatorSeigs
        timestamp
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