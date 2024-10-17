import { gql } from "@apollo/client";

export const GET_CANDIDATE = gql`
  query GetCandidate($id: String) {
    candidates(first: 1000, orderBy: stakedAmount, orderDirection: desc) {
      id
      candidate
      candidateContract
      name
      stakedAmount
      commissionRate
      candidateAddOn {
        id
        rollupConfig
        operator
        memo
        bridge
        portal
        txData
        stateRoot
        seigGiven: seigGiven(first: 10, orderBy: blockTimestamp, orderDirection: desc) {
          id
          l2TotalSeigs
          layer2Seigs
          blockTimestamp
        }
      }
      stakedUserList: stakedUserList(first:1000, orderBy:stakedAmount, orderDirection: desc) {
        id
        stakedAmount
        user {
          id
        }
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
      withdrawL2: withdrawalAndDeposited(first:1000) {
        id
        amount
        timestamp
        eventName
        sender
        transaction {
          id
        }
        candidate {
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

export const GET_CHANGED_MEMBER = gql`
  query GetChangedMember($id: String) {    
    changedMembers(first: 100, orderBy: timestamp, orderDirection: desc) {
      id
      slotIndex
      newMember
      timestamp
    }
}
`