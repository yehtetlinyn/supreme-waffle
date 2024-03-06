import { create } from "zustand";
import { sanitizeObject } from "@/app/utils/sanitizer";
import {
  GET_CERTIFICATES,
  GET_CERTIFICATE_ICONS,
} from "@/graphql/queries/certifications";
import apolloClient from "@/lib/apolloClient";

const useCertificationsStore = create((set, get) => ({
  getCertificates: async ({ where }) => {
    // set({ loading: true });

    const { data, error, loading } = await apolloClient.query({
      query: GET_CERTIFICATES,
      variables: where,
      fetchPolicy: "network-only",
    });

    if (data) {
      const sanitizedCertificateInfo =
        data?.certificates.data?.map(sanitizeObject);
      set({ certificateInfo: sanitizedCertificateInfo });
      set({ total: data.certificates.meta.pagination.total });
      set({ pageCount: data.certificates.meta.pagination.pageCount });
      set({ loading: false });
      return new Promise((resolve) => {
        resolve(sanitizedCertificateInfo);
      });
    }
  },
  getCertificateIcons: async ({ where }) => {
    const { data, error, loading } = await apolloClient.query({
      query: GET_CERTIFICATE_ICONS,
      variables: where,
      fetchPolicy: "network-only",
    });

    if (data) {
      const sanitizedCertificateIconsInfo =
        data?.certificateIcons?.map(sanitizeObject);
      set({ iconsLoading: false });
      set({ certificateIconsInfo: sanitizedCertificateIconsInfo });
      return new Promise((resolve) => {
        resolve(sanitizedCertificateIconsInfo);
      });
    }
  },
  fetch: false,
  loading: true,
  iconsLoading: true,
  certificateInfo: [],
  certificateIconsInfo: [],
  total: 0,
  pageCount: 0,
}));

export default useCertificationsStore;
