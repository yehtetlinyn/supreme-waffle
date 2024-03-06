import { gql } from "@apollo/client";

export const GET_USERS = gql`
  query (
    $id: ID
    $userName: String
    $projectId: ID
    $blocked: Boolean
    $page: Int
    $pageSize: Int
  ) {
    usersPermissionsUsers(
      filters: {
        and: [
          { id: { eqi: $id } }
          { username: { containsi: $userName } }
          { blocked: { eq: $blocked } }
          { profile: { projects: { id: { eq: $projectId } } } }
        ]
      }
      pagination: { page: $page, pageSize: $pageSize }
      sort: ["updatedAt:desc"]
    ) {
      data {
        id
        attributes {
          username
          email
          createdAt
          facialScanImage {
            data {
              id
              attributes {
                url
                name
              }
            }
          }
          profile {
            data {
              id
              attributes {
                gender
                joinedDate
                contactNumber
                education
                firstName
                lastName
                email
                photo {
                  data {
                    id
                    attributes {
                      name
                      url
                    }
                  }
                }
                position {
                  data {
                    id
                    attributes {
                      name
                    }
                  }
                }
                department {
                  data {
                    id
                    attributes {
                      name
                    }
                  }
                }
                addresses {
                  id
                  Title
                  AddressLine1
                  City
                  State
                  PostalCode
                  Country
                  TimeZone
                }
                certificateProfiles {
                  data {
                    id
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
