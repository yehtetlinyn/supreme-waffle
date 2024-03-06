import { create } from "zustand";
import { sanitizeObject } from "@/app/utils/sanitizer";
import apolloClient from "@/lib/apolloClient";
import { GET_PROFILES } from "@/graphql/queries/profile";

const useProfileStore = create((set, get) => ({
  fetch: false,
  loading: true,
  profileInfo: [],
  total: 0,
  pageCount: 0,
  getProfiles: async ({ where }) => {
    try {
      const { data, error, loading } = await apolloClient.query({
        query: GET_PROFILES,
        variables: where,
        fetchPolicy: "network-only",
      });

      if (data) {
        const sanitizedProfileInfo = data?.profiles.data?.map(sanitizeObject);
        set({
          profileInfo: sanitizedProfileInfo,
          total: data.profiles.meta.pagination.total,
          pageCount: data.profiles.meta.pagination.pageCount,
          loading: false,
        });
      }
    } catch (error) {
      set({ loading: false });
      console.log("error", error);
    }
  },
}));

export default useProfileStore;
