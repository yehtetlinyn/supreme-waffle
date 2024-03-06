import { gql } from "@apollo/client";

export const GET_ANNOUNCEMENTS = gql`
  query getAnnouncements(
    $id: ID
    $title: String
    $pageNum: Int
    $pageSize: Int
  ) {
    announcements(
      filters: { and: [{ id: { eq: $id } }, { title: { containsi: $title } }] }
      pagination: { page: $pageNum, pageSize: $pageSize }
      sort: ["updatedAt:desc"]
    ) {
      data {
        id
        attributes {
          title
          content
          pinned
          publishDate
          endDate
          createdByProfile {
            data {
              id
              attributes {
                fullName
              }
            }
          }
          createdAt
          updatedAt
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
