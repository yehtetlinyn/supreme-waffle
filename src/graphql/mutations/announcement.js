import { gql } from "@apollo/client";

export const CREATE_ANNOUNCEMENTS = gql`
  mutation createAnnouncement($data: AnnouncementInput!) {
    createAnnouncement(data: $data) {
      data {
        id
      }
    }
  }
`;

export const UPDATE_ANNOUNCEMENTS = gql`
  mutation updateAnnouncement($id: ID!, $data: AnnouncementInput!) {
    updateAnnouncement(id: $id, data: $data) {
      data {
        id
      }
    }
  }
`;

export const DELETE_ANNOUNCEMENTS = gql`
  mutation deleteAnnouncement($id: ID!) {
    deleteAnnouncement(id: $id) {
      data {
        id
      }
    }
  }
`;
