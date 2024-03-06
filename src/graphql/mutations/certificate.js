import { gql } from "@apollo/client";

export const CREATE_CERTIFICATE = gql`
  mutation ($data: CertificateInput!) {
    createCertificate(data: $data) {
      data {
        id
      }
    }
  }
`;

export const UPDATE_CERTIFICATE = gql`
  mutation ($id: ID!, $data: CertificateInput!) {
    updateCertificate(id: $id, data: $data) {
      data {
        id
      }
    }
  }
`;

export const DELETE_CERTIFICATE = gql`
  mutation ($id: ID!) {
    deleteCertificate(id: $id) {
      data {
        id
      }
    }
  }
`;
