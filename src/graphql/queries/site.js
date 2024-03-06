import { gql } from "@apollo/client";

export const GET_SITES = gql`
  query ($name: String, $start: Int, $limit: Int) {
    sites(
      filters: {
        and: [{ name: { containsi: $name } }, { deleted: { eq: false } }]
      }
      pagination: { start: $start, limit: $limit }
      sort: "updatedAt:desc"
    ) {
      data {
        id
        attributes {
          name
          description
          contacts {
            Telephone
            Mobile
          }
          address
          location {
            id
            Name
            Lat
            Long
            Area
          }
          checkpoints {
            id
            Name
            Location {
              Name
              Lat
              Long
              Area
            }
            QRcode {
              data {
                attributes {
                  url
                  formats
                }
              }
            }
          }
          shiftRosters {
            data {
              id
            }
          }
        }
      }
      meta {
        pagination {
          total
          page
          pageSize
          pageCount
        }
      }
    }
  }
`;

export const GET_SITE = gql`
  query ($id: ID) {
    site(id: $id) {
      data {
        id
        attributes {
          name
          description
          contacts {
            Telephone
            Mobile
          }
          address
          location {
            id
            Name
            Lat
            Long
            Area
          }
        }
      }
    }
  }
`;

export const GET_SITE_NAME = gql`
  query ($id: ID) {
    site(id: $id) {
      data {
        id
        attributes {
          name
        }
      }
    }
  }
`;

export const GET_ATTENDANCE_CHECKPOINTS = gql`
  query ($id: ID) {
    site(id: $id) {
      data {
        attributes {
          name
          checkpoints {
            id
            Name
            Location {
              Name
              Lat
              Long
              Area
            }
            QRcode {
              data {
                id
                attributes {
                  url
                  # formats
                  name
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_ATTENDANCE_HISTORY = gql`
  query getAttendanceHistory($dutyDate: Date, $pageNum: Int, $pageSize: Int) {
    assignedRosters(
      sort: ["dutyDate:desc"]
      filters: { dutyDate: { lte: $dutyDate } }
      pagination: { page: $pageNum, pageSize: $pageSize }
    ) {
      data {
        id
        attributes {
          profile {
            data {
              id
              attributes {
                fullName
                photo {
                  data {
                    id
                    attributes {
                      url
                      alternativeText
                    }
                  }
                }
              }
            }
          }
          shiftRoster {
            data {
              id
              attributes {
                title
              }
            }
          }
          dutyDate
          startTime
          endTime
          attendanceLogs {
            data {
              id
              attributes {
                type
                dateAndTime
                notes
              }
            }
          }
        }
      }
      meta {
        pagination {
          page
          total
          pageSize
          pageCount
        }
      }
    }
  }
`;

export const GET_SHIFT_SETTING = gql`
  query ($siteId: ID) {
    site(id: $siteId) {
      data {
        attributes {
          shiftRosters(filters: { site: { id: { eq: $siteId } } }) {
            data {
              id
              attributes {
                title
                description
                numberOfHeads
                numberOfGuards
                numberOfSupervisors
                timeRange {
                  id
                  StartTime
                  EndTime
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_SHIFT_SETTING_COUNT = gql`
  query ($siteId: ID) {
    site(id: $siteId) {
      data {
        attributes {
          shiftRosters {
            data {
              id
            }
          }
        }
      }
    }
  }
`;
