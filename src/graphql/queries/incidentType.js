import { gql } from "@apollo/client";

export const GET_INCIDENT_TYPES = gql`
  query {
    incidentTypes {
      data {
        id
        attributes {
          name
        }
      }
    }
  }
`;
