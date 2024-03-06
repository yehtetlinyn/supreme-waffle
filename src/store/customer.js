import { create } from "zustand";
import apolloClient from "@/lib/apolloClient";
import { sanitizeObject } from "@/app/utils/sanitizer";
import { GET_CUSTOMER } from "@/graphql/queries/customer";

const useCustomerStore = create((set, get) => ({
  customerData: [],
  selectedCustomerData: {},
  total: 0,
  pageCount: 0,
  loading: false,
  loadingForSelectedCustomer: false,

  getCustomers: async ({
    id,
    customerName,
    projectID,
    currentPage,
    pageSize,
  }) => {
    const filter = {
      id: { eq: id },
      and: [
        {
          or: [
            {
              firstName: { containsi: customerName },
            },
            {
              lastName: { containsi: customerName },
            },
          ],
        },
        {
          project: {
            id: { eq: projectID },
          },
        },
      ],
    };

    try {
      set({ loading: true });
      const { data } = await apolloClient.query({
        fetchPolicy: "network-only",
        query: GET_CUSTOMER,
        variables: {
          filters: filter,
          pageNum: currentPage,
          pageSize: pageSize,
        },
      });

      if (data) {
        const sanitizedCustomerData = data.customers.data?.map(sanitizeObject);
        set({
          loading: false,
          customerData: sanitizedCustomerData,
          total: data?.customers.meta?.pagination.total,
          pageCount: data?.customers.meta?.pagination.pageCount,
        });
      }
    } catch (error) {
      set({ loading: false });
      console.log("error", error);
    }
  },

  getCustomerByID: async ({ id }) => {
    const filter = {
      id: { eq: id },
    };

    try {
      set({ loadingForSelectedCustomer: true });
      const { data } = await apolloClient.query({
        fetchPolicy: "network-only",
        query: GET_CUSTOMER,
        variables: {
          filters: filter,
        },
      });

      if (data) {
        const sanitizedCustomerData = data.customers.data?.map(sanitizeObject);
        set({
          loadingForSelectedCustomer: false,
          selectedCustomerData: sanitizedCustomerData[0],
        });
      }
    } catch (error) {
      set({ loadingForSelectedCustomer: false });
      console.log("error", error);
    }
  },
}));

export default useCustomerStore;
