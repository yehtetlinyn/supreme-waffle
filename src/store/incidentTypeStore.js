import { create } from "zustand";
import apolloClient from "@/lib/apolloClient";
import { GET_INCIDENT_TYPES } from "@/graphql/queries/incidentType";

const useIncidentTypeStore = create((set, get) => ({
  incidentTypeData: [],
  loading: false,

  fetchIncidentType: async () => {
    try {
      set({ loading: true });
      const { data } = await apolloClient.query({
        fetchPolicy: "network-only",
        query: GET_INCIDENT_TYPES,
      });
      if (data) {
        set({ incidentTypeData: data?.incidentTypes?.data, loading: false });
      }
    } catch (error) {
      set({ loading: false });
      console.log("error", error);
    }
  },
}));

export default useIncidentTypeStore;
