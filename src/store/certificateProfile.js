import { create } from "zustand";
import { sanitizeObject } from "@/app/utils/sanitizer";
import apolloClient from "@/lib/apolloClient";
import { GET_CERTIFICATE_PROFILE } from "@/graphql/queries/certificateProfile";

const useCertificateProfileStore = create((set, get) => ({
  getCertificateProfiles: async ({ where }) => {
    // set({ loading: true });

    const { data, error, loading } = await apolloClient.query({
      query: GET_CERTIFICATE_PROFILE,
      variables: where,
      fetchPolicy: "network-only",
    });

    if (data) {
      const certificateProfileInfo =
        data?.certificateProfiles.data?.map(sanitizeObject);
      set({ loading: false });
      set({ CertificateProfileInfo: certificateProfileInfo });
      set({ total: data.certificateProfiles.meta.pagination.total });
      set({ pageCount: data.certificateProfiles.meta.pagination.pageCount });
      return new Promise((resolve) => {
        resolve(certificateProfileInfo);
      });
    }
  },
  fetch: false,
  loading: true,
  CertificateProfileInfo: [],
  total: 0,
  pageCount: 0,
}));

export default useCertificateProfileStore;
