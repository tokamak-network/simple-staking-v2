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
        transaction {
          id
        }
      }
      unstaked {
        id
        amount
        timestamp
        eventName
        sender
        transaction {
          id
        }
      }
      withdrawal {
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