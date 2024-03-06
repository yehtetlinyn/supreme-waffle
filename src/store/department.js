import { create } from "zustand";
import { sanitizeObject } from "@/app/utils/sanitizer";
import apolloClient from "@/lib/apolloClient";
import { GET_DEPARTMENTS } from "@/graphql/queries/department";

const useDepartmentStore = create((set, get) => ({
  fetch: false,
  loading: true,
  departmentInfo: [],
  total: 0,
  pageCount: 0,

  getDepartments: async ({ where }) => {
    try {
      set({ loading: true });
      const { data } = await apolloClient.query({
        query: GET_DEPARTMENTS,
        variables: where,
        fetchPolicy: "network-only",
      });

      if (data) {
        const sanitizedDepartmentsInfo =
          data?.departments.data?.map(sanitizeObject);
        set({
          departmentInfo: sanitizedDepartmentsInfo,
          total: data.departments.meta.pagination.total,
          pageCount: data.departments.meta.pagination.pageCount,
          loading: false,
        });
      }
    } catch (error) {
      set({ loading: false });
      console.log("error", error);
    }
  },
}));

export default useDepartmentStore;
