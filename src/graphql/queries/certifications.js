import { gql } from "@apollo/client";

export const GET_CERTIFICATES = gql`
  query (
    $id: ID
    $name: String
    $providedBy: String
    $trainingLocation: String
    $deleted: Boolean
    $page: Int
    $pageSize: Int
    $profileLimit: Int
    $limit: Int
  ) {
    certificates(
      filters: {
        and: [
          { id: { eq: $id } }
          { name: { containsi: $name } }
          { providerName: { containsi: $providedBy } }
          { trainingLocation: { containsi: $trainingLocation } }
          { deleted: { eq: $deleted } }
        ]
      }
      pagination: { page: $page, pageSize: $pageSize, limit: $limit }
      sort: ["updatedAt:desc"]
    ) {
      data {
        id
        attributes {
          name
          description
          providerName
          duration
          trainingLocation
          verification
          logo {
            data {
              id
              attributes {
                name
                url
                alternativeText
              }
            }
          }
          profiles {
            data {
              id
              attributes {
                fullName
                photo {
                  data {
                    id
                    attributes {
                      url
                    }
                  }
                }
              }
            }
          }
          certificateProfiles {
            data {
              id
              attributes {
                profiles(pagination: { limit: $profileLimit }) {
                  data {
                    id
                  }
                }
                validityPeriod
                issueDate
                expirationDate
                completionDate
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

export const GET_CERTIFICATE_ICONS = gql`
  query {
    certificateIcons {
      id
      name
      alternativeText
      url
    }
  }
`;
