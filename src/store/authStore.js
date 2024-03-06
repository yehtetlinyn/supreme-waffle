"use client";
import { create } from "zustand";

import { GET_ME } from "@/graphql/queries/me";
import { LOGIN } from "@/graphql/mutations/auth";
import { persist, createJSONStorage } from "zustand/middleware";
import { API_URL } from "@/config";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import apolloClient from "@/lib/apolloClient";

const GRAPHQL_URL = `${API_URL}/graphql`;

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,

      initData: null,
      requestOtpInfo: null,
      verifyOtpInfo: null,
      resendOtpInfo: null,
      resetOtpInfo: null,

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

      handleAuthenticate: async ({ token }) => {
        let initData = {};

        if (token) {
          try {
            const client = new ApolloClient({
              uri: GRAPHQL_URL,
              headers: {
                authorization: `Bearer ${token}`,
              },
              cache: new InMemoryCache(),
            });
            const { data } = await client.query({ query: GET_ME });
            const userData = {
              ...data.me,
            };

            initData = {
              user: userData,
            };
          } catch (error) {
            console.log(error);
          }
        }

        set({ initData: initData });
      },

      setRequestOtpInfo: (userInfo) => set({ requestOtpInfo: userInfo }),

      setVerifyOtpInfo: (userInfo) => set({ verifyOtpInfo: userInfo }),

      setResendOtpInfo: (userInfo) => set({ resendOtpInfo: userInfo }),

      setResetOtpInfo: (userInfo) => set({ resetOtpInfo: userInfo }),

      resetOtpStates: () => {
        set({
          initData: null,
          requestOtpInfo: null,
          verifyOtpInfo: null,
          resendOtpInfo: null,
          resetOtpInfo: null,
        });
      },

      // Callback to handle user logout
      logout: () => {
        set({ isAuthenticated: false, token: null, user: null });
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
