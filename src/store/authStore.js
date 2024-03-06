"use client";
import { create } from "zustand";

import { GET_ME } from "@/graphql/queries/me";
import { LOGIN } from "@/graphql/mutations/auth";
import { persist, createJSONStorage } from "zustand/middleware";
import apolloClient from "@/lib/apolloClient";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,

      initData: null,

      error: "",
      success: "",
      appLoading: true,
      loading: false,
      isAuthenticated: false,
      rememberMe: true,

      // Callback to check logged in user session
      getSession: async () => {
        try {
          set({ appLoading: true });

          const { rememberMe } = get();
          const meResponse = await apolloClient.query({
            query: GET_ME,
            fetchPolicy: "no-cache",
            errorPolicy: "all",
          });

          let { me: loggedInuser } = meResponse.data;

          if (!rememberMe) {
            set({
              appLoading: false,
              isAuthenticated: false,
              user: null,
            });
          } else {
            set({
              appLoading: false,
              isAuthenticated: true,
              user: loggedInuser,
            });
          }
        } catch (error) {
          set({
            user: null,
            appLoading: false,
            isAuthenticated: false,
          });
        }
      },

      // Callback to authenticate user using ideitnfier and password
      authenticate: async ({ identifier, password, rememberMe }) => {
        try {
          set({ loading: true });
          const response = await apolloClient.mutate({
            mutation: LOGIN,
            variables: {
              identifier,
              password,
            },
          });

          if (!response.data.login.data && response.data.login?.error) {
            throw new Error(response.data.login?.error.message);
          }

          let { jwt } = response.data.login.data;
          set({ token: jwt });

          const meResponse = await apolloClient.query({
            query: GET_ME,
            fetchPolicy: "no-cache",
            errorPolicy: "all",
          });

          let { me: loggedInuser } = meResponse.data;

          set({
            token: jwt,
            loading: false,
            isAuthenticated: true,
            user: loggedInuser,
            rememberMe: rememberMe,
            success: "You have successfully logged in",
          });
        } catch (error) {
          set({ error: error.message, loading: false, isAuthenticated: false });
        }
      },
    }),
    {
      name: "authSession",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        rememberMe: state.rememberMe,
      }),
    }
  )
);

export default useAuthStore;
