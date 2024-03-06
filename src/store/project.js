import { create } from "zustand";
import { GET_PROJECTS } from "@/graphql/queries/project";
import apolloClient from "@/lib/apolloClient";
import { sanitizeObject } from "@/app/utils/sanitizer";

const useProjectStore = create((set, get) => ({
  projectData: [],
  projectTitle: "",
  despatchCount: 0,
  issueCount: 0,
  participantCount: 0,
  customerCount: 0,
  leaveRedirectLink: "",
  customerViewModal: false,
  total: 0,
  pageCount: 0,
  loading: false,

  getProjects: async ({ id, projectName, deleted, currentPage, pageSize }) => {
    const filter = {
      id: { eq: id },
      and: [
        {
          name: { containsi: projectName },
        },
        {
          deleted: { eq: deleted },
        },
      ],
    };

    try {
      set({ loading: true });
      const { data } = await apolloClient.query({
        fetchPolicy: "network-only",
        query: GET_PROJECTS,
        variables: {
          filters: filter,
          pageNum: currentPage,
          pageSize: pageSize,
        },
      });

      if (data) {
        const sanitizedProjectData = data.projects.data?.map(sanitizeObject);
        set({
          loading: false,
          projectData: sanitizedProjectData,
          // projectTitle: sanitizedProjectData[0].name,
          total: data?.projects.meta?.pagination.total,
          pageCount: data?.projects.meta?.pagination.pageCount,
        });
      }
    } catch (error) {
      set({ loading: false });
      console.log("error", error);
    }
  },

  getProjectByID: async ({ id, deleted }) => {
    const filter = {
      and: [
        {
          id: { eq: id },
        },
        {
          deleted: { eq: deleted },
        },
      ],
    };

    try {
      set({ loading: true });
      const { data } = await apolloClient.query({
        fetchPolicy: "network-only",
        query: GET_PROJECTS,
        variables: {
          filters: filter,
        },
      });

      if (data) {
        const sanitizedProjectData = data.projects.data?.map(sanitizeObject);
        set({
          loading: false,
          projectData: sanitizedProjectData,
          projectTitle: sanitizedProjectData[0].name,
          despatchCount: sanitizedProjectData[0].despatchTypes?.length,
          issueCount: sanitizedProjectData[0].issueTypes?.length,
          participantCount: sanitizedProjectData[0].profiles?.length,
          customerCount: sanitizedProjectData[0].customers?.length,
        });
      }
    } catch (error) {
      set({ loading: false });
      console.log("error", error);
    }
  },
}));

export default useProjectStore;
