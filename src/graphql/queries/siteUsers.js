import { gql } from "@apollo/client";

export const GET_SITE_USERS = gql`
  query ($filters: ProfileFiltersInput, $pageNum: Int, $pageSize: Int) {
    profiles(
      filters: $filters
      sort: "createdAt:asc"
      pagination: { page: $pageNum, pageSize: $pageSize }
    ) {
      data {
        id
        attributes {
          sites {
            data {
              attributes {
                name
              }
            }
          }
          fullName
          firstName
          lastName
          email
          joinedDate
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
              attributes {
                url
                formats
                name
              }
            }
          }
          gender
          joinedDate
          contactNumber
          department {
            data {
              id
              attributes {
                name
              }
            }
          }
          position {
            data {
              attributes {
                name
              }
            }
          }
          education
          addresses {
            AddressLine1
            AddressLine2
            City
            State
            PostalCode
            Country
            TimeZone
          }
          certificateProfiles {
            data {
              attributes {
                expirationDate
                issueDate
                completionDate
                certificate {
                  data {
                    id
                    attributes {
                      name
                    }
                  }
                }
              }
            }
          }
          user {
            data {
              id
              attributes {
                # firstName
                # lastName
                email
                facialScanImage {
                  data {
                    attributes {
                      url
                      name
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
          pageSize
          pageCount
          page
        }
      }
    }
  }
`;

// get all profiles but exclude profiles under current site
export const GET_ALL_PROFILES = gql`
  query {
    profiles(pagination: { limit: -1 }) {
      data {
        id
        attributes {
          sites {
            data {
              id
            }
          }
          fullName
          firstName
          lastName
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
`;
