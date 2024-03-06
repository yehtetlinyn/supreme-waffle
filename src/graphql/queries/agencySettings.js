import { gql } from "@apollo/client";

export const GET_AGENCY_SETTINGS = gql`
  query {
    agencySetting {
      data {
        id
        attributes {
          name
          footerNotes
          activateTheme
          logo {
            id
            SmallSize {
              data {
                id
                attributes {
                  url
                }
              }
            }
            LargeSize {
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
    }
  }
`;
