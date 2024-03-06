import { create } from "zustand";
import dayjs from "dayjs";
import { produce } from "immer";
import { v4 as uuid } from "uuid";
import apolloClient from "@/lib/apolloClient";
import { GET_ANNOUNCEMENTS } from "@/graphql/queries/announcement";
import { renderFormatDate, renderFormatDateTime } from "@/utils/helpers";

const storeState = {
  announcementData: null,
  announceId: null,
  fetch: null,
  total: 0,
  pageCount: 0,
  loading: false,
  announcePin: false,
  noExpiry: false,
};

const announceStore = (set, get) => ({
  ...storeState,
  handleRefresh: () => set({ fetch: uuid() }),

  handlePinAnnouncement: (isPinned) => set({ announcePin: isPinned }),

  handleNoExpiry: (noExpired) => set({ noExpiry: noExpired }),

  getAnnouncementById: async (announceId) => {
    try {
      set({ loading: true });
      const {
        data: { announcements: announcements },
      } = await apolloClient.query({
        fetchPolicy: "network-only",
        query: GET_ANNOUNCEMENTS,
        variables: { id: parseInt(announceId) },
      });

      const announcementData = announcements.data.map((item) => {
        const publishDate = item.attributes.publishDate;
        const endDate = item.attributes.endDate;
        const noExpiry = publishDate && !endDate;

        return {
          id: item.id,
          title: item.attributes.title,
          content: item.attributes.content,
          pinned: item.attributes.pinned,
          publishDate: publishDate,
          endDate: endDate,
          noExpiry: noExpiry,
        };
      });

      announcementData[0]?.noExpiry && set({ noExpiry: true });

      set({
        announcementData: announcementData[0],
        announceId: announcementData[0]?.id,
        loading: false,
      });
    } catch (error) {
      set({ loading: false });
      console.log("error", error);
    }
  },

  getAnnouncements: async ({ filterInput, currentPage, pageSize }) => {
    try {
      set({ loading: true });
      const {
        data: { announcements: announcements },
      } = await apolloClient.query({
        fetchPolicy: "network-only",
        query: GET_ANNOUNCEMENTS,
        variables: {
          title: filterInput || undefined,
          pageNum: currentPage,
          pageSize: pageSize,
        },
      });

      const announcementData = announcements.data.map((item) => {
        const publishDate = item.attributes.publishDate;
        const endDate = item.attributes.endDate;

        const schedule =
          publishDate && !endDate
            ? renderFormatDate(publishDate)
            : !publishDate && endDate
            ? renderFormatDate(endDate)
            : `${renderFormatDate(publishDate)} - ${renderFormatDate(endDate)}`;

        return {
          id: item.id,
          title: item.attributes.title,
          content: item.attributes.content,
          pinned: item.attributes.pinned,
          publishDate: publishDate,
          endDate: endDate,
          schedule: schedule,
          createdAt: renderFormatDateTime(item.attributes.createdAt),
        };
      });

      set({
        announcementData: announcementData,
        total: announcements.meta?.pagination?.total,
        pageCount: announcements.meta?.pagination?.pageCount,
        loading: false,
      });
    } catch (error) {
      set({ loading: false });
      console.log("error", error);
    }
  },

  resetAnnouncementStates: () => {
    set(
      produce((draft) => {
        draft.noExpiry = false;
      })
    );
  },
});

const useAnnouncementStore = create(announceStore);
export default useAnnouncementStore;
