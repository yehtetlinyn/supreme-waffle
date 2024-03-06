import { gql } from "@apollo/client";

export const GET_NEWS = gql`
  query getNews($id: ID, $title: String, $pageNum: Int, $pageSize: Int) {
    pluralNews(
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
          media {
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
