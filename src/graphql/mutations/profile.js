import { gql } from "@apollo/client";

export const CREATE_PROFILE = gql`
  mutation ($data: ProfileInput!) {
    createProfile(data: $data) {
      data {
        id
        attributes {
          fullName
        }
      }
    }
  }
`;

export const UPDATE_PROFILE = gql`
  mutation ($id: ID!, $data: ProfileInput!) {
    updateProfile(id: $id, data: $data) {
      data {
        id
      }
    }
  }
`;

export const DELETE_PROFILE = gql`
  mutation ($id: ID!) {
    deleteProfile(id: $id) {
      data {
        id
      }
    }
  }
`;
