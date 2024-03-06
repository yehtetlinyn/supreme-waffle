import { gql } from "@apollo/client";

export const CREATE_POSITIONS = gql`
  mutation ($data: PositionInput!) {
    createPosition(data: $data) {
      data {
        id
      }
    }
  }
`;

export const UPDATE_POSITIONS = gql`
  mutation ($id: ID!, $data: PositionInput!) {
    updatePosition(id: $id, data: $data) {
      data {
        id
      }
    }
  }
`;

export const DELETE_POSITIONS = gql`
  mutation ($id: ID!) {
    deletePosition(id: $id) {
      data {
        id
      }
    }
  }
`;
