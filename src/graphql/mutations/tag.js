import { gql } from "@apollo/client";

export const CREATE_TAG = gql`
  mutation ($data: TagInput!) {
    createTag(data: $data) {
      data {
        id
      }
    }
  }
`;

export const UPDATE_TAG = gql`
  mutation ($id: ID!, $data: TagInput!) {
    updateTag(id: $id, data: $data) {
      data {
        id
      }
    }
  }
`;

export const DELETE_TAG = gql`
  mutation ($id: ID!) {
    deleteTag(id: $id) {
      data {
        id
      }
    }
  }
`;
