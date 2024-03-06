import { create } from "zustand";
import apolloClient from "@/lib/apolloClient";
import { GET_AGENCY_SETTINGS } from "@/graphql/queries/agencySettings";

const useAgencySettingStore = create((set, get) => ({
  theme: "",
  backgroundColor: "",
  buttonColor: "",
  primaryColor: "",
  secondaryColor: "",
  tableColor: "",
  textColor: "",
  footerNotes: "",
  imageUrl: "",
  isLoading: false,
  selectedTheme: "",
  smallLogo: "",
  largeLogo: "",
  getAgencySettings: async () => {
    set({ isLoading: true });
    const { data, error, loading } = await apolloClient.query({
      query: GET_AGENCY_SETTINGS,
      fetchPolicy: "network-only",
    });

    if (data) {
      console.log("data", data);
      set({
        theme:
          data?.agencySetting?.data?.attributes?.activateTheme?.themeOptions
            ?.name,
        selectedTheme:
          data?.agencySetting?.data?.attributes?.activateTheme?.themeOptions
            ?.name,
        backgroundColor:
          data?.agencySetting?.data?.attributes?.activateTheme?.themeOptions
            ?.palette?.background,
        buttonColor:
          data?.agencySetting?.data?.attributes?.activateTheme?.themeOptions
            ?.palette?.button,
        primaryColor:
          data?.agencySetting?.data?.attributes?.activateTheme?.themeOptions
            ?.palette?.primary,
        secondaryColor:
          data?.agencySetting?.data?.attributes?.activateTheme?.themeOptions
            ?.palette?.secondary,
        tableColor:
          data?.agencySetting?.data?.attributes?.activateTheme?.themeOptions
            ?.palette?.table,
        textColor:
          data?.agencySetting?.data?.attributes?.activateTheme?.themeOptions
            ?.palette?.text,
        footerNotes: data?.agencySetting?.data?.attributes?.footerNotes,
        smallLogo:
          data?.agencySetting?.data?.attributes?.logo?.SmallSize?.data
            ?.attributes?.url,
        largeLogo:
          data?.agencySetting?.data?.attributes?.logo?.LargeSize?.data
            ?.attributes?.url,
      });
    }
    set({ isLoading: false });
  },
  handlePrimaryColorChange: (e) => {
    set({
      primaryColor: { main: e.target.value },
      theme: "custom-theme",
    });
  },
  handleSecondaryColorChange: (e) => {
    set({ secondaryColor: { main: e.target.value }, theme: "custom-theme" });
  },
  handleBackgroundColorChange: (e) => {
    const { backgroundColor } = get();
    set({
      backgroundColor: { ...backgroundColor, [e.target.name]: e.target.value },
      theme: "custom-theme",
    });
  },

  handleTableColorChange: (e) => {
    const { tableColor } = get();
    set({
      tableColor: { ...tableColor, [e.target.name]: e.target.value },
      theme: "custom-theme",
    });
  },
  handleTextColorChange: (e) => {
    const { textColor } = get();
    set({
      textColor: { ...textColor, [e.target.name]: e.target.value },
      theme: "custom-theme",
    });
  },
  handleButtonColorChange: (e) => {
    const { buttonColor } = get();
    set({
      buttonColor: { ...buttonColor, [e.target.name]: e.target.value },
      theme: "custom-theme",
    });
  },

  setFooterNotes: (e) => set({ footerNotes: e.target.value }),
  setSelectedTheme: (theme) => set({ selectedTheme: theme }),
  handleChangeTheme: (theme) => {
    console.log("here change theme", theme);
    if (theme === "nexstack") {
      set({
        theme: "nexstack",
        backgroundColor: {
          card: "#ffffff",
          default: "#ffffff",
          sidebar: "#f4f4f4",
        },
        buttonColor: { main: "#0d549a", contrastText: "#ffffff" },
        primaryColor: { main: "#0f0ccf" },
        secondaryColor: { main: "#2396cb" },
        tableColor: { background: "#ffffff", selectedRow: "#26689b" },
        textColor: {
          hint: "#393232",
          primary: "#7c7070",
          warning: "#b51414",
          secondary: "#b79797",
        },
      });
    }
    if (theme === "tossakan") {
      set({
        theme: "tossakan",
        backgroundColor: {
          card: "#ffffff",
          default: "#ffffff",
          sidebar: "#f4f4f4",
        },
        buttonColor: { main: "#0d549a", contrastText: "#ffffff" },
        primaryColor: { main: "#ffd000" },
        secondaryColor: { main: "#2396cb" },
        tableColor: { background: "#ffffff", selectedRow: "#26689b" },
        textColor: {
          hint: "#393232",
          primary: "#7c7070",
          warning: "#b51414",
          secondary: "#b79797",
        },
      });
    }
    if (theme === "prosegur") {
      set({
        theme: "prosegur",
        backgroundColor: {
          card: "#ffffff",
          default: "#ffffff",
          sidebar: "#f4f4f4",
        },
        buttonColor: { main: "#e6dc25", contrastText: "#ffffff" },
        primaryColor: { main: "#cdea12" },
        secondaryColor: { main: "#2396cb" },
        tableColor: { background: "#ffffff", selectedRow: "#26689b" },
        textColor: {
          hint: "#393232",
          primary: "#7c7070",
          warning: "#b51414",
          secondary: "#b79797",
        },
      });
    }
    return theme;
  },
  setImageUrl: (url) => set({ imageUrl: url }),
  setSmallLogo: (url) => set({ smallLogo: url }),
  setLargeLogo: (url) => set({ largeLogo: url }),
}));

export default useAgencySettingStore;
