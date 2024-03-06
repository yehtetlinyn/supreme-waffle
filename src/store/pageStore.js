import { create } from "zustand";
import { produce } from "immer";

const storeState = {
  agencySettingTab: "web",
  shiftRosterTab: "rosterAssignment",
  leaveModal: false,
  clickSecondBreadcrumb: false,
  sidebarLinkName: null,
  modalId: null,
  activeButton: 1,
  selectedAccordion: 0,
  isSubMenuExpand: {},
  siteTabName: "",
  isFormDirty: false,
  isSidebarCollapsed: false,
};

const pageStore = (set, get) => ({
  ...storeState,
  setCurrentTab: (name, value) => {
    set({ [name]: value });
  },

  setSelectedAccordion: (accordion) => set({ selectedAccordion: accordion }),

  setActiveButton: (isActive) => set({ activeButton: isActive }),

  setModalId: (id) => set({ modalId: id }),

  handleLeaveOpen: (isLeave) => {
    set({ leaveModal: isLeave });
  },

  handleClickSecondBreadcrumb: (isClick) => {
    set({ clickSecondBreadcrumb: isClick });
  },

  setSidebarLinkName: (link) => {
    set({ sidebarLinkName: link });
  },

  setIsSubMenuExpand: (isExpand) => {
    set((prev) => ({
      isSubMenuExpand: {
        ...prev.isSubMenuExpand,
        ...isExpand,
      },
    }));
  },

  setIsSidebarCollapsed: (isCollapsed) => {
    set({ isSidebarCollapsed: isCollapsed });
  },

  setSiteTabName: (tab) => {
    set({ siteTabName: tab });
  },

  setIsFormDirty: (dirty) => {
    set({ isFormDirty: dirty });
  },

  resetPageStates: () => {
    set(
      produce((draft) => {
        draft.selectedAccordion = 0;
      })
    );
  },
});

const usePageStore = create(pageStore);
export default usePageStore;
