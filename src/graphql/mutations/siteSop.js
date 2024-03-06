import { gql } from "@apollo/client";

export const CREATE_SITE_SOP = gql`
  mutation (
    $siteId: ID!
    $title: String!
    $description: String!
    $type: ID!
    $impact: ENUM_COMPONENTINCIDENTTYPE_IMPACT
    $priority: ENUM_COMPONENTINCIDENTTYPE_PRIORITY
    $tasks: [ComponentCommonTaskInput]
  ) {
    createSiteSop(
      data: {
        site: $siteId
        name: $title
        description: $description
        incident: { Type: $type, Impact: $impact, Priority: $priority }
        tasks: $tasks
      }
    ) {
      data {
        id
        attributes {
          name
        }
      }
    }
  }
`;

export const UPDATE_SITE_SOP = gql`
  mutation (
    $siteSopId: ID!
    $siteId: ID!
    $title: String!
    $description: String!
    $type: ID!
    $impact: ENUM_COMPONENTINCIDENTTYPE_IMPACT
    $priority: ENUM_COMPONENTINCIDENTTYPE_PRIORITY
    $tasks: [ComponentCommonTaskInput]
  ) {
    updateSiteSop(
      id: $siteSopId
      data: {
        site: $siteId
        name: $title
        description: $description
        incident: { Type: $type, Impact: $impact, Priority: $priority }
        tasks: $tasks
      }
    ) {
      data {
        id
        attributes {
          name
        }
      }
    }
  }
`;

export const DELETE_SITE_SOP = gql`
  mutation ($id: ID!) {
    deleteSiteSop(id: $id) {
      data {
        id
      }
    }
  }
`;
