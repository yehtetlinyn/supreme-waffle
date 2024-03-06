import { gql } from "@apollo/client";

export const GET_PROFILES = gql`
  query (
    $positionId: ID
    $projectId: ID
    $blocked: Boolean
    $pageNum: Int
    $pageSize: Int
    $notEqCertificate: ID
    $limit: Int
  ) {
    profiles(
      filters: {
        and: [
          { position: { id: { eqi: $positionId } } }
          { projects: { id: { eqi: $projectId } } }
          { certificates: { id: { ne: $notEqCertificate } } }
          { user: { blocked: { eq: $blocked } } }
        ]
      }
      pagination: { page: $pageNum, pageSize: $pageSize, limit: $limit }
      sort: ["updatedAt:desc"]
    ) {
      data {
        id
        attributes {
          fullName
          position {
            data {
              id
              attributes {
                name
              }
            }
          }
          photo {
            data {
              id
              attributes {
                url
              }
            }
          }
          user {
            data {
              id
              attributes {
                email
              }
            }
          }
          certificates {
            data {
              id
            }
          }
          projects {
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
