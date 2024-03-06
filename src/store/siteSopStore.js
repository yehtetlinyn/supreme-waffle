import { create } from "zustand";
import { v4 as uuid } from "uuid";
import { GET_SITE_SOPS } from "@/graphql/queries/siteSop";
import apolloClient from "@/lib/apolloClient";

const useSiteSopStore = create((set, get) => ({
  siteSopData: null,
  loading: false,
  fetch: false,
  siteSopCount: 0,
  siteSopPageCount: 0,
  copyMasterSopData: null,
  isCopyMasterSop: false,
  isCopySopModalOpen: false,
  isSiteSopModalOpen: false,

  handleRefresh: () => {
    set({ fetch: uuid() });
  },

  resetFormState: () => {
    set({
      copyMasterSopData: null,
      isCopyMasterSop: false,
      isCopySopModalOpen: false,
      isSiteSopModalOpen: false,
    });
  },

  setIsCopyMasterSop: (copy) => {
    set({ isCopyMasterSop: copy });
  },

  setCopyMasterSopData: (masterSopData) => {
    set({ copyMasterSopData: masterSopData });
  },

  setIsCopySopModalOpen: (isOpen) => {
    set({ isCopySopModalOpen: isOpen });
  },

  setIsSiteSopModalOpen: (isOpen) => {
    set({ isSiteSopModalOpen: isOpen });
  },

  fetchSiteSops: async ({
    incidentId,
    replacedTitle,
    priority,
    siteSopCurrentPage,
    pageSize,
    id,
  }) => {
    const filter = {
      site: { id: { eq: id } },
      and: [
        {
          incident: { Type: incidentId ? { id: { eq: incidentId } } : {} },
        },
        { name: replacedTitle ? { containsi: replacedTitle } : {} },
        {
          incident: { Priority: priority ? { containsi: priority } : {} },
        },
      ],
    };

    try {
      set({ loading: true });
      const { data } = await apolloClient.query({
        fetchPolicy: "network-only",
        query: GET_SITE_SOPS,
        variables: {
          filters: filter,
          pageNum: siteSopCurrentPage,
          pageSize: pageSize,
        },
      });
      if (data) {
        const siteSopData = data?.siteSops?.data?.map((data) => {
          return {
            id: data?.id,
            name: data?.attributes?.name,
            description: data?.attributes?.description,
            incident: data?.attributes?.incident?.Type,
            impact: data?.attributes?.incident?.Impact,
            priority: data?.attributes?.incident?.Priority,
            tasks: data?.attributes?.tasks,
          };
        });
        set({
          siteSopData: siteSopData,
          loading: false,
          siteSopCount: data?.siteSops?.meta?.pagination?.total,
          siteSopPageCount: data?.siteSops?.meta?.pagination?.pageCount,
        });
      }
    } catch (error) {
      set({ loading: false });
      console.log("error", error);
    }
  },
}));

export default useSiteSopStore;
