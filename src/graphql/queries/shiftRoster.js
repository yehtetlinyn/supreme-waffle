import { gql } from "@apollo/client";

export const GET_SHIFT_SETTINGS_BY_SITE_ID = gql`
  query ($siteId: ID!) {
    shiftRosters(
      filters: { site: { id: { eq: $siteId } } }
      sort: "createdAt:asc"
    ) {
      data {
        id
        attributes {
          title
          timeRange {
            StartTime
            EndTime
          }
          numberOfHeads
          repeatDays
        }
      }
      meta {
        pagination {
          total
        }
      }
    }
  }
`;

export const GET_ASSIGNED_ROSTERS_USERS = gql`
  query getAssignedRosterUsers($filters: AssignedRosterFiltersInput) {
    assignedRosters(filters: $filters) {
      data {
        id
        attributes {
          dutyDay
          dutyDate
          shiftRoster {
            data {
              id
              attributes {
                numberOfHeads
              }
            }
          }
          profile {
            data {
              id
              attributes {
                fullName
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_HEAD_COUNT_BY_SHIFT_ID = gql`
  query getShiftRoster($filters: ShiftRosterFiltersInput) {
    shiftRosters(filters: $filters) {
      data {
        id
        attributes {
          numberOfHeads
        }
      }
    }
  }
`;
