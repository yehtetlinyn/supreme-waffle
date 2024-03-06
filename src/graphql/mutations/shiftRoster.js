import { gql } from "@apollo/client";

export const CREATE_SHIFT_SETTING = gql`
  mutation (
    $title: String!
    $startTime: Time!
    $endTime: Time!
    $siteId: ID!
    $headCount: Int!
    $repeatDays: JSON!
  ) {
    createShiftRoster(
      data: {
        title: $title
        timeRange: { StartTime: $startTime, EndTime: $endTime }
        site: $siteId
        numberOfHeads: $headCount
        repeatDays: $repeatDays
      }
    ) {
      data {
        id
      }
    }
  }
`;

export const UPDATE_SHIFT_SETTING = gql`
  mutation (
    $title: String
    $startTime: Time
    $endTime: Time
    $siteId: ID!
    $headCount: Int
    $repeatDays: JSON!
    $shiftSettingId: ID!
  ) {
    updateShiftRoster(
      id: $shiftSettingId
      data: {
        title: $title
        timeRange: { StartTime: $startTime, EndTime: $endTime }
        site: $siteId
        numberOfHeads: $headCount
        repeatDays: $repeatDays
      }
    ) {
      data {
        id
      }
    }
  }
`;

export const DELETE_SHIFT_SETTING = gql`
  mutation deleteShiftRoster($shiftSettingId: ID!) {
    deleteShiftRoster(id: $shiftSettingId) {
      data {
        id
      }
    }
  }
`;
