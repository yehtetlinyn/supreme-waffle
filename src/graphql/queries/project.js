import { gql } from "@apollo/client";

export const GET_PROJECTS = gql`
  query ($filters: ProjectFiltersInput, $pageNum: Int, $pageSize: Int) {
    projects(
      filters: $filters
      sort: "updatedAt:desc"
      pagination: { page: $pageNum, pageSize: $pageSize }
    ) {
      data {
        id
        attributes {
          name
          description
          addresses {
            Title
            Address1
            Floor
            UnitNumber
            Location
            PostalCode
          }
          tags {
            data {
              id
            }
          }
          document {
            data {
              id
              attributes {
                name
                url
              }
            }
          }
          despatchTypes {
            data {
              id
              attributes {
                name
              }
            }
          }
          issueTypes {
            data {
              id
              attributes {
                name
              }
            }
          }
          profiles(
            filters: { user: { blocked: { eq: false } } }
            pagination: { limit: -1 }
          ) {
            data {
              id
              attributes {
                fullName
              }
            }
          }
          customers(pagination: { limit: -1 }) {
            data {
              id
              attributes {
                firstName
                lastName
              }
            }
          }
          despatchRequests {
            data {
              id
              attributes {
                requestId
              }
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
