import { IconDiscord } from './../common/Icons/IconDiscord';
import { getCandidateCreateEvent } from '@/api';
import { gql } from "@apollo/client";

export const GET_CANDIDATE = gql`
  query GetCandidate($id: String) {
    candidates(first: 10) {
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
      }
      unstaked {
        id
      }
      withdrawal {
        id
      }
      addedSeig {
        id
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