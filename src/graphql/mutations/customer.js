import { gql } from "@apollo/client";

export const CREATE_CUSTOMER = gql`
  mutation ($data: CustomerInput!) {
    createCustomer(data: $data) {
      data {
        id
      }
    }
  }
`;

export const UPDATE_CUSTOMER = gql`
  mutation ($id: ID!, $data: CustomerInput!) {
    updateCustomer(id: $id, data: $data) {
      data {
        id
      }
    }
  }
`;

export const DELETE_CUSTOMER = gql`
  mutation ($id: ID!) {
    deleteCustomer(id: $id) {
      data {
        id
      }
    }
  }
`;
