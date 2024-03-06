import { gql } from "@apollo/client";

export const CREATE_DESPATCHTYPE = gql`
  mutation ($data: DespatchTypeInput!) {
    createDespatchType(data: $data) {
      data {
        id
      }
    }
  }
`;

export const UPDATE_DESPATCHTYPE = gql`
  mutation ($id: ID!, $data: DespatchTypeInput!) {
    updateDespatchType(id: $id, data: $data) {
      data {
        id
      }
    }
  }
`;

export const DELETE_DESPATCHTYPE = gql`
  mutation ($id: ID!) {
    deleteDespatchType(id: $id) {
      data {
        id
      }
    }
  }
`;
