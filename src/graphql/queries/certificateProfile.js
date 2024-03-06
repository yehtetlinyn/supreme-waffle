import { gql } from "@apollo/client";

export const GET_CERTIFICATE_PROFILE = gql`
  query (
    $certificateProfileId: ID
    $certificateId: ID
    $profileLimit: Int
    $page: Int
    $pageSize: Int
  ) {
    certificateProfiles(
      filters: {
        and: [
          { id: { eqi: $certificateProfileId } }
          { certificate: { id: { eqi: $certificateId } } }
        ]
      }
      pagination: { page: $page, pageSize: $pageSize }
      sort: ["updatedAt:desc"]
    ) {
      data {
        id
        attributes {
          completionDate
          validityPeriod
          issueDate
          expirationDate
          certificate {
            data {
              id
              attributes {
                name
              }
            }
          }
          profiles(pagination: { limit: $profileLimit }) {
            data {
              id
              attributes {
                fullName
                user {
                  data {
                    attributes {
                      email
                    }
                  }
                }
                photo {
                  data {
                    attributes {
                      url
                    }
                  }
                }
              }
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
