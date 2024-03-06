import { gql } from "@apollo/client";

export const GET_POSITIONS = gql`
  query (
    $id: ID
    $name: String
    $deleted: Boolean
    $pageNum: Int
    $pageSize: Int
    $limit: Int
    $profileLimit: Int
  ) {
    positions(
      filters: {
        and: [
          { id: { eq: $id } }
          { name: { containsi: $name } }
          { deleted: { eq: $deleted } }
        ]
      }
      pagination: { page: $pageNum, pageSize: $pageSize, limit: $limit }
      sort: ["updatedAt:desc"]
    ) {
      data {
        id
        attributes {
          name
          description
          salary
          currency
          totalProfilesCount
          profiles(pagination: { limit: $profileLimit }) {
            data {
              id
            }
          }
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
