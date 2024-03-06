import { create } from "zustand";
import { sanitizeObject } from "@/app/utils/sanitizer";
import apolloClient from "@/lib/apolloClient";
import { GET_POSITIONS } from "@/graphql/queries/positions";

const usePositionStore = create((set, get) => ({
  fetch: false,
  loading: true,
  positionInfo: [],
  positionTitle: "",
  total: 0,
  pageCount: 0,

  getPositions: async ({ where }) => {
    try {
      set({ loading: true });
      const { data } = await apolloClient.query({
        query: GET_POSITIONS,
        variables: where,
        fetchPolicy: "network-only",
      });

      if (data) {
        console.log("position", data);
        const sanitizedpositionInfo = data?.positions.data?.map(sanitizeObject);
        set({
          positionInfo: sanitizedpositionInfo,
          positionTitle: sanitizedpositionInfo[0]?.name,
          total: data.positions.meta.pagination.total,
          pageCount: data.positions.meta.pagination.pageCount,
          loading: false,
        });
      }
    } catch (error) {
      set({ loading: false });
      console.log("error", error);
    }
  },
}));

export default usePositionStore;
