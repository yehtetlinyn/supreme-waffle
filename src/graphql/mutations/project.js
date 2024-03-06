import { gql } from "@apollo/client";

export const CREATE_PROJECT = gql`
  mutation ($data: ProjectInput!) {
    createProject(data: $data) {
      data {
        id
      }
    }
  }
`;

export const UPDATE_PROJECT = gql`
  mutation ($id: ID!, $data: ProjectInput!) {
    updateProject(id: $id, data: $data) {
      data {
        id
      }
    }
  }
`;

export const DELETE_PROJECT = gql`
  mutation ($id: ID!) {
    deleteProject(id: $id) {
      data {
        id
      }
    }
  }
`;
