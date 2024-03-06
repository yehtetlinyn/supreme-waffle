import { GET_MASTER_SOP, GET_SOP_MASTERS } from "@/graphql/queries/sopMaster";
import apolloClient from "@/lib/apolloClient";
import { create } from "zustand";
import { v4 as uuid } from "uuid";

const useMasterSOPStore = create((set, get) => ({
  masterSOPData: null,
  masterSOPName: null,
  loading: false,
  fetch: false,
  masterSOPCount: 0,
  masterSOPPageCount: 0,

  handleRefresh: () => {
    set({ fetch: uuid() });
  },

  fetchMasterSOP: async ({
    incidentId = "",
    replacedTitle = "",
    priority = "",
    currentPage,
    pageSize,
  }) => {
    const filter = {
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
        query: GET_SOP_MASTERS,
        variables: {
          filters: filter,
          pageNum: currentPage,
          pageSize: pageSize,
        },
      });
      if (data) {
        const masterSopData = data?.sopMasters?.data?.map((data) => {
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
          masterSOPData: masterSopData,
          loading: false,
          masterSOPCount: data?.sopMasters?.meta?.pagination?.total,
          masterSOPPageCount: data?.sopMasters?.meta?.pagination?.pageCount,
        });
      }
    } catch (error) {
      set({ loading: false });
      console.log("error", error);
    }
  },

  fetchMasterSOPById: async (id) => {
    try {
      set({ loading: true });
      const { data } = await apolloClient.query({
        fetchPolicy: "network-only",
        query: GET_MASTER_SOP,
        variables: {
          id: id,
        },
      });
      if (data) {
        set({
          masterSOPData: data?.sopMaster?.data?.attributes,
          loading: false,
        });
      }
    } catch (error) {
      set({ loading: false });
      console.log("error", error);
    }
  },
}));

export default useMasterSOPStore;
