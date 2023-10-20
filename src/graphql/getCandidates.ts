import { IconDiscord } from './../common/Icons/IconDiscord';
import { getCandidateCreateEvent } from '@/api';
import { gql } from "@apollo/client";

export const GET_CANDIDATE = gql`
  query GetCandidate($id: String) {
    candidates(where:{stakedAmount_gt:0}) {
      id
      candidate
      candidateContract
      name
      stakedAmount
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
    }
  }
`;

