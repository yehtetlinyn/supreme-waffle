import { create } from "zustand";
import apolloClient from "@/lib/apolloClient";
import { sanitizeObject } from "@/app/utils/sanitizer";
import { GET_TAG } from "@/graphql/queries/tag";

const useTagStore = create((set, get) => ({
  tagData: [],
  tagTitle: "",
  tagOptions: [],
  total: 0,
  pageCount: 0,
  loading: false,

  getTags: async ({ id, tagName, currentPage, pageSize, limit }) => {
    const filter = {
      id: { eq: id },
      name: { contains: tagName },
    };

    try {
      set({ loading: true });
      const { data } = await apolloClient.query({
        fetchPolicy: "network-only",
        query: GET_TAG,
        variables: {
          filters: filter,
          pageNum: currentPage,
          pageSize: pageSize,
          limit: limit,
        },
      });

      if (data) {
        const sanitizedTagData = data.tags.data?.map(sanitizeObject);
        set({
          loading: false,
          tagData: sanitizedTagData,
          tagTitle: sanitizedTagData[0].name,
          total: data?.tags.meta?.pagination.total,
          pageCount: data?.tags.meta?.pagination.pageCount,
        });
      }
    } catch (error) {
      set({ loading: false });
      console.log("error", error);
    }
  },

  getTagOptions: async () => {
    try {
      set({ loading: true });
      const { data } = await apolloClient.query({
        fetchPolicy: "network-only",
        query: GET_TAG,
        variables: {
          limit: -1,
        },
      });

      if (data) {
        const sanitizedTagData = data.tags.data?.map(sanitizeObject);
        set({
          loading: false,
          tagOptions: sanitizedTagData.map((tag) => ({
            value: tag.id,
            label: tag.name,
          })),
        });
      }
    } catch (error) {
      set({ loading: false });
      console.log("error", error);
    }
  },
}));

export default useTagStore;
