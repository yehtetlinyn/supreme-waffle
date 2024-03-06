import { gql } from "@apollo/client";

export const GET_DEPARTMENTS = gql`
  query ($limit: Int) {
    departments(pagination: { limit: $limit }) {
      data {
        id
        attributes {
          name
        }
      }
      meta {
        pagination {
          total
          page
          pageSize
          pageCount
        }
      }
    }
  }
`;
