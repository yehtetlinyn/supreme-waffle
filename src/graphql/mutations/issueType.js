import { gql } from "@apollo/client";

export const CREATE_ISSUETYPE = gql`
  mutation ($data: IssueTypeInput!) {
    createIssueType(data: $data) {
      data {
        id
      }
    }
  }
`;

export const UPDATE_ISSUETYPE = gql`
  mutation ($id: ID!, $data: IssueTypeInput!) {
    updateIssueType(id: $id, data: $data) {
      data {
        id
      }
    }
  }
`;

export const DELETE_ISSUETYPE = gql`
  mutation ($id: ID!) {
    deleteIssueType(id: $id) {
      data {
        id
      }
    }
  }
`;
