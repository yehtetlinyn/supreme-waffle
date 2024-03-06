import { gql } from "@apollo/client";

export const CREATE_NEWS = gql`
  mutation createNews($data: NewsInput!) {
    createNews(data: $data) {
      data {
        id
      }
    }
  }
`;

export const UPDATE_NEWS = gql`
  mutation updateNews($id: ID!, $data: NewsInput!) {
    updateNews(id: $id, data: $data) {
      data {
        id
      }
    }
  }
`;

export const DELETE_NEWS = gql`
  mutation deleteNews($id: ID!) {
    deleteNews(id: $id) {
      data {
        id
      }
    }
  }
`;
