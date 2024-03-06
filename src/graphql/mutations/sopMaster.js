import { gql } from "@apollo/client";

export const CREATE_SOP_MASTER = gql`
  mutation (
    $title: String!
    $description: String!
    $type: ID!
    $impact: ENUM_COMPONENTINCIDENTTYPE_IMPACT
    $priority: ENUM_COMPONENTINCIDENTTYPE_PRIORITY
    $tasks: [ComponentCommonTaskInput]
  ) {
    createSopMaster(
      data: {
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

export const UPDATE_SOP_MASTER = gql`
  mutation (
    $id: ID!
    $title: String!
    $description: String!
    $type: ID!
    $impact: ENUM_COMPONENTINCIDENTTYPE_IMPACT
    $priority: ENUM_COMPONENTINCIDENTTYPE_PRIORITY
    $tasks: [ComponentCommonTaskInput]
  ) {
    updateSopMaster(
      id: $id
      data: {
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

export const DELETE_SOP_MASTER = gql`
  mutation ($id: ID!) {
    deleteSopMaster(id: $id) {
      data {
        id
      }
    }
  }
`;
