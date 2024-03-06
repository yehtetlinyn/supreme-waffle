import { gql } from "@apollo/client";

export const GET_ISSUETYPES = gql`
  query (
    $filters: IssueTypeFiltersInput
    $limit: Int
    $pageNum: Int
    $pageSize: Int
  ) {
    issueTypes(
      filters: $filters
      sort: "updatedAt:desc"
      pagination: { page: $pageNum, pageSize: $pageSize, limit: $limit }
    ) {
      data {
        id
        attributes {
          name
          impact
          priority
          description
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
