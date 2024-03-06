import { gql } from "@apollo/client";

export const CREATE_USERS = gql`
  mutation ($data: UsersPermissionsUserInput!) {
    createUsersPermissionsUser(data: $data) {
      data {
        id
        attributes {
          username
          email
          profile {
            data {
              id
            }
          }
        }
      }
    }
  }
`;

export const UPDATE_USER = gql`
  mutation ($id: ID!, $data: UsersPermissionsUserInput!) {
    updateUsersPermissionsUser(id: $id, data: $data) {
      data {
        id
        attributes {
          username
          profile {
            data {
              id
            }
          }
        }
      }
    }
  }
`;

export const DELETE_USER = gql`
  mutation ($id: ID!) {
    deleteUsersPermissionsUser(id: $id) {
      data {
        id
        attributes {
          profile {
            data {
              id
            }
          }
        }
      }
    }
  }
`;
