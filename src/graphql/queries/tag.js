import { gql } from "@apollo/client";

export const GET_TAG = gql`
  query (
    $filters: TagFiltersInput
    $pageNum: Int
    $pageSize: Int
    $limit: Int
  ) {
    tags(
      filters: $filters
      pagination: { page: $pageNum, pageSize: $pageSize, limit: $limit }
      sort: ["updatedAt:desc"]
    ) {
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
