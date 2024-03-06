import { create } from "zustand";
import { GET_ISSUETYPES } from "@/graphql/queries/issueType";
import apolloClient from "@/lib/apolloClient";
import { sanitizeObject } from "@/app/utils/sanitizer";

const useIssueTypeStore = create((set, get) => ({
  issueTypeData: [],
  total: 0,
  pageCount: 0,
  loading: false,

  getIssueTypes: async ({ projectID, currentPage, pageSize, limit }) => {
    const filter = {
      and: [
        {
          projects: { id: { eq: projectID } },
        },
      ],
    };

    try {
      set({ loading: true });
      const { data } = await apolloClient.query({
        fetchPolicy: "network-only",
        query: GET_ISSUETYPES,
        variables: {
          filters: filter,
          pageNum: currentPage,
          pageSize: pageSize,
          limit: limit,
        },
      });

      if (data) {
        const sanitizedIssueTypeData =
          data.issueTypes.data?.map(sanitizeObject);
        set({
          loading: false,
          issueTypeData: sanitizedIssueTypeData,
          total: data?.issueTypes.meta?.pagination.total,
          pageCount: data?.issueTypes.meta?.pagination.pageCount,
        });
      }
    } catch (error) {
      set({ loading: false });
      console.log("error", error);
    }
  },
}));

export default useIssueTypeStore;
