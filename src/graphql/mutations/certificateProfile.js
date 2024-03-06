import { gql } from "@apollo/client";

export const CREATE_CERTIFICATE_PROFILE = gql`
  mutation ($data: CertificateProfileInput!) {
    createCertificateProfile(data: $data) {
      data {
        id
      }
    }
  }
`;

export const UPDATE_CERTIFICATE_PROFILE = gql`
  mutation ($id: ID!, $data: CertificateProfileInput!) {
    updateCertificateProfile(id: $id, data: $data) {
      data {
        id
      }
    }
  }
`;

export const DELETE_CERTIFICATE_PROFILE = gql`
  mutation ($id: ID!) {
    deleteCertificateProfile(id: $id) {
      data {
        id
      }
    }
  }
`;
