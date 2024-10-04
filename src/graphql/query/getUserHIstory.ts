import { gql } from "@apollo/client";

export const GET_HISTORY = gql`
  query GetUserHistory($id: String) {
    users(where: {id: $id}) {
      id
      staked  (orderBy: timestamp, orderDirection: desc){
        id
        amount
        timestamp
        eventName
        candidate {
          id
          name
        }
        transaction {
          id
          blockNumber
        }
        
      }
      unstaked  (orderBy: timestamp, orderDirection: desc){
        id
        amount
        timestamp
        eventName
        candidate {
          id
          name
        }
        transaction {
          id
          blockNumber
        }
      }
      withdrawal  (orderBy: timestamp, orderDirection: desc){
        id
        amount
        timestamp
        eventName
        candidate {
          id
          name
        }
        transaction {
          id
          blockNumber
        }
      }
    }
  }
`;
