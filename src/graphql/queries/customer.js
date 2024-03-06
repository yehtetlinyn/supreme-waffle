import { gql } from "@apollo/client";

export const GET_CUSTOMER = gql`
  query ($filters: CustomerFiltersInput, $pageNum: Int, $pageSize: Int) {
    customers(
      filters: $filters
      sort: "updatedAt:desc"
      pagination: { page: $pageNum, pageSize: $pageSize }
    ) {
      data {
        id
        attributes {
          firstName
          lastName
          uen
          email
          contactNumber
          address {
            id
            Title
            Address1
            Floor
            UnitNumber
            Location
            PostalCode
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
