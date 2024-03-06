import { gql } from "@apollo/client";

export const GET_SOP_MASTERS = gql`
  query ($filters: SopMasterFiltersInput, $pageNum: Int, $pageSize: Int) {
    sopMasters(
      filters: $filters
      sort: "updatedAt:desc"
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
                  description
                }
              }
            }
            Impact
            Priority
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
          pageSize
          pageCount
          page
        }
      }
    }
  }
`;

export const GET_MASTER_SOP = gql`
  query ($id: ID!) {
    sopMaster(id: $id) {
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
                  description
                }
              }
            }
            Impact
            Priority
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
    }
  }
`;
