import { create } from "zustand";
import { sanitizeObject } from "@/app/utils/sanitizer";
import apolloClient from "@/lib/apolloClient";
import { GET_USERS } from "@/graphql/queries/user";

const useUsersStore = create((set, get) => ({
  fetch: false,
  loading: true,
  userInfo: [],
  total: 0,
  pageCount: 0,
  importType: "multiple",
  tabNumber: 1,
  accountInfo: {},
  profileInfo: {},

  setProfileInfo: (info) => set({ profileInfo: info }),

  setAccountInfo: (info) => set({ accountInfo: info }),

  handleTabChange: (tab) => set({ tabNumber: tab }),

  setImportType: (type) => set({ importType: type }),

  getUsers: async ({ where }) => {
    try {
      set({ loading: true });
      const { data } = await apolloClient.query({
        query: GET_USERS,
        variables: where,
        fetchPolicy: "network-only",
      });

      if (data) {
        const sanitizedUsersInfo =
          data?.usersPermissionsUsers.data?.map(sanitizeObject);
        set({
          userInfo: sanitizedUsersInfo,
          total: data.usersPermissionsUsers.meta.pagination.total,
          pageCount: data.usersPermissionsUsers.meta.pagination.pageCount,
          loading: false,
        });
      }
    } catch (error) {
      set({ loading: false });
      console.log("error", error);
    }
  },
}));

export default useUsersStore;
