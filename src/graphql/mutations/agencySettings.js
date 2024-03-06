import { gql } from "@apollo/client";

export const UPDATE_AGENCY_SETTING = gql`
  mutation ($data: AgencySettingInput!) {
    updateAgencySetting(data: $data) {
      data {
        id
        attributes {
          activateTheme
        }
      }
    }
  }
`;
