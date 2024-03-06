import { create } from "zustand";
import apolloClient from "@/lib/apolloClient";
import { v4 as uuid } from "uuid";
import { GET_ALL_PROFILES, GET_SITE_USERS } from "@/graphql/queries/siteUsers";
import { sanitizeObject } from "@/app/utils/sanitizer";

const useSiteUserStore = create((set, get) => ({
  fetch: false,
  loading: false,
  siteUsersData: null,
  siteUsersCount: 0,
  siteUserPageCount: 0,
  notAssignedUserData: null,

  handleRefresh: () => {
    set({ fetch: uuid() });
  },

  fetchSiteUsers: async ({ siteId, currentPage, pageSize, username }) => {
    const filter = {
      sites: { id: { eq: siteId } },
      fullName: username ? { containsi: username } : {},
    };
    try {
      set({ loading: true });
      const { data } = await apolloClient.query({
        fetchPolicy: "network-only",
        query: GET_SITE_USERS,
        variables: {
          filters: filter,
          pageNum: currentPage,
          pageSize: pageSize,
        },
      });
      if (data) {
        const siteUsersData = data?.profiles?.data?.map((profile) => {
          return {
            ...profile?.attributes,
            id: profile?.id,
            email: profile?.attributes?.user?.data?.attributes?.email,
            joinedDate: profile?.attributes?.joinedDate,
            position: profile?.attributes?.position?.data,
            department: profile?.attributes?.department?.data,
          };
        });
        set({
          siteUsersData,
          siteUsersData,
          loading: false,
          siteUsersCount: data?.profiles?.meta?.pagination?.total,
          siteUserPageCount: data?.profiles?.meta?.pagination?.pageCount,
        });
      }
    } catch (error) {
      set({ loading: false });
      console.log("error", error);
    }
  },

  //fetch data from profile table
  fetchAllUsers: async ({ id }) => {
    try {
      set({ loading: true });
      const { data } = await apolloClient.query({
        fetchPolicy: "network-only",
        query: GET_ALL_PROFILES,
        variables: {
          siteId: id,
        },
      });
      if (data) {
        // Find and remove the data under current site id
        const notAssignedUserData = data.profiles.data.filter((profile) => {
          const siteIds = profile.attributes.sites.data.map((site) => site.id);
          return !siteIds.includes(id);
        });

        set({
          notAssignedUserData: notAssignedUserData,
          loading: false,
        });
      }
    } catch (error) {
      console.log("error", error);
      set({ loading: false });
    }
  },
}));

export default useSiteUserStore;
