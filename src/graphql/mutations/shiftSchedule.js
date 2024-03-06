import { gql } from "@apollo/client";

export const UPDATE_ASSIGNED_ROSTER = gql`
  mutation updateAssignedRoster(
    $assignedRosterId: ID!
    $profileId: ID
    $remark: String
  ) {
    updateAssignedRoster(
      id: $assignedRosterId
      data: { profile: $profileId, remark: $remark }
    ) {
      data {
        id
      }
    }
  }
`;

export const CREATE_ASSIGNED_ROSTER = gql`
  mutation createAssignedRoster($data: AssignedRosterInput!) {
    createAssignedRoster(data: $data) {
      data {
        id
      }
    }
  }
`;

export const REMOVE_SITE_SHIFT = gql`
  mutation removeSiteShift($shiftId: ID!, $data: ShiftRosterInput!) {
    updateShiftRoster(id: $shiftId, data: $data) {
      data {
        id
      }
    }
  }
`;

export const DELETE_ASSIGNED_ROSTER = gql`
  mutation deleteAssignedRoster($assignedRosterId: ID!) {
    deleteAssignedRoster(id: $assignedRosterId) {
      data {
        id
      }
    }
  }
`;
