import { gql } from "@apollo/client";

export const GET_DESPATCHES = gql`
  query (
    $filters: DespatchTypeFiltersInput
    $limit: Int
    $pageNum: Int
    $pageSize: Int
  ) {
    despatchTypes(
      filters: $filters
      sort: "updatedAt:desc"
      pagination: { page: $pageNum, pageSize: $pageSize, limit: $limit }
    ) {
      data {
        id
        attributes {
          name
          code
          headcountNumber
          durationInHours
          tasks {
            Name
            Steps {
              Serial
              Description
              Status
            }
          }
          description
          project {
            data {
              id
            }
          }
          despatchRequests {
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
          pageCount
          pageSize
        }
      }
    }
  }
`;
