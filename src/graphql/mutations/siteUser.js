import { gql } from "@apollo/client";

export const ASSIGN_USERS_TO_SITE = gql`
  mutation ($siteId: ID!, $profileIDs: [ID]) {
    updateSite(id: $siteId, data: { profiles: $profileIDs }) {
      data {
        id
        attributes {
          name
          profiles {
            data {
              attributes {
                fullName
              }
            }
          }
        }
      }
    }
  }
`;

export const REMOVE_ASSIGN_USERS_FROM_SITE = gql`
  mutation ($profileId: ID!) {
    updateProfile(id: $profileId, data: { sites: null }) {
      data {
        id
      }
    }
  }
`;
