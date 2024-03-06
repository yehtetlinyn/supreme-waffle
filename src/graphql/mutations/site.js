import { gql } from "@apollo/client";

export const CREATE_SITE = gql`
  mutation (
    $siteName: String!
    $address: String!
    $location: ComponentCommonLocationInput
    $contacts: ComponentCommonContactInput
    $description: String!
  ) {
    createSite(
      data: {
        name: $siteName
        address: $address
        location: $location
        contacts: $contacts
        description: $description
      }
    ) {
      data {
        id
        attributes {
          name
          address
          location {
            Name
          }
        }
      }
    }
  }
`;

export const UPDATE_SITE = gql`
  mutation ($id: ID!, $data: SiteInput!) {
    updateSite(id: $id, data: $data) {
      data {
        id
        attributes {
          name
        }
      }
    }
  }
`;

export const UPDATE_SITE_ATTENDANCE_CHECKPOINT = gql`
  mutation ($id: ID!, $checkpointArray: [ComponentCommonCheckpointInput]) {
    updateSite(id: $id, data: { checkpoints: $checkpointArray }) {
      data {
        id
      }
    }
  }
`;

export const UPDATE_SITE_SHIFT_SETTING = gql`
  mutation ($id: ID!, $shiftRostersArray: [ID]) {
    updateSite(id: $id, data: { shiftRosters: $shiftRostersArray }) {
      data {
        id
      }
    }
  }
`;

export const DELETE_SITE = gql`
  mutation ($id: ID!, $isDelete: Boolean!) {
    updateSite(id: $id, data: { deleted: $isDelete }) {
      data {
        id
        attributes {
          name
          deleted
        }
      }
    }
  }
`;
