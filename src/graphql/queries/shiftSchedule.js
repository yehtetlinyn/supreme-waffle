import { gql } from "@apollo/client";

export const GET_HEAD_COUNTS_BY_SITE_ID = gql`
  query getHeadCountsBySiteId($siteId: ID!) {
    shiftRosters(filters: { site: { id: { eq: $siteId } } }) {
      data {
        id
        attributes {
          numberOfHeads
          timeRange {
            StartTime
            EndTime
          }
        }
      }
    }
  }
`;

export const GET_SHIFT_ASSIGNED_USERS = gql`
  query getShiftAssignedUsers(
    $filters: ShiftRosterFiltersInput
    $assignedRostersInput: AssignedRosterFiltersInput
  ) {
    shiftRosters(filters: $filters) {
      data {
        id
        attributes {
          title
          numberOfHeads
          repeatDays
          timeRange {
            StartTime
            EndTime
          }
          assignedRosters(filters: $assignedRostersInput) {
            data {
              id
              attributes {
                dutyDate
                dutyDay
                profile {
                  data {
                    id
                    attributes {
                      fullName
                      email
                      status
                      position {
                        data {
                          id
                          attributes {
                            name
                          }
                        }
                      }
                      photo {
                        data {
                          id
                          attributes {
                            name
                            url
                            alternativeText
                            width
                            height
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
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

export const GET_ASSIGNED_ROSTER = gql`
  query getAssignedRoster($filters: AssignedRosterFiltersInput) {
    assignedRosters(filters: $filters) {
      data {
        id
        attributes {
          startTime
          endTime
          dutyDate
          dutyDay
          profile {
            data {
              id
            }
          }
          shiftRoster {
            data {
              id
            }
          }
        }
      }
    }
  }
`;

export const GET_SITE_USERS = gql`
  query getSiteUsers($filters: ProfileFiltersInput) {
    profiles(filters: $filters) {
      data {
        id
        attributes {
          fullName
          email
          status
          position {
            data {
              id
              attributes {
                name
              }
            }
          }
          photo {
            data {
              id
              attributes {
                name
                url
                alternativeText
                width
                height
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_ASSIGNED_ROSTER_IDS = gql`
  query getAssignedRosterIds($filters: AssignedRosterFiltersInput) {
    assignedRosters(filters: $filters) {
      data {
        id
        attributes {
          profile {
            data {
              id
            }
          }
        }
      }
    }
  }
`;
