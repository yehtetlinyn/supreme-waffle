import { gql } from "@apollo/client";

export const GET_SITE_SOPS = gql`
  query ($filters: SiteSopFiltersInput, $pageNum: Int, $pageSize: Int) {
    siteSops(
      filters: $filters
      sort: "updatedAt:asc"
      pagination: { page: $pageNum, pageSize: $pageSize }
    ) {
      data {
        id
        attributes {
          name
          description
          incident {
            Type {
              data {
                id
                attributes {
                  name
                }
              }
            }
            Priority
            Impact
          }
          tasks {
            Name
            Steps {
              Serial
              Description
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
