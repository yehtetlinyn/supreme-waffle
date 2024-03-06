import { create } from "zustand";
import { GET_DESPATCHES } from "@/graphql/queries/despatch";
import apolloClient from "@/lib/apolloClient";
import { sanitizeObject } from "@/app/utils/sanitizer";

const useDespatchStore = create((set, get) => ({
  despatchData: [],
  total: 0,
  pageCount: 0,
  loading: false,

  getDespatches: async ({ projectID, currentPage, pageSize, limit }) => {
    const filter = {
      and: [
        {
          project: { id: { eq: projectID } },
        },
      ],
    };

    try {
      set({ loading: true });
      const { data } = await apolloClient.query({
        fetchPolicy: "network-only",
        query: GET_DESPATCHES,
        variables: {
          filters: filter,
          pageNum: currentPage,
          pageSize: pageSize,
          limit: limit,
        },
      });

      if (data) {
        const sanitizedDespatchData =
          data.despatchTypes.data?.map(sanitizeObject);
        set({
          loading: false,
          despatchData: sanitizedDespatchData,
          total: data?.despatchTypes.meta?.pagination.total,
          pageCount: data?.despatchTypes.meta?.pagination.pageCount,
        });
      }
    } catch (error) {
      set({ loading: false });
      console.log("error", error);
    }
  },
}));

export default useDespatchStore;
