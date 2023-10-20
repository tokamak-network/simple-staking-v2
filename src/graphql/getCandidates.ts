import { getCandidateCreateEvent } from '@/api';
import { gql } from "@apollo/client";

export const GET_CANDIDATE = gql`
  query GetCandidate($id: String) {
    candidates(first: 10) {
      id
      name
      candidate
      candidateContract
      stakedAmount
    }
  }
`;

