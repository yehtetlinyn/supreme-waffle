import { create } from "zustand";
import { v4 as uuid } from "uuid";
import apolloClient from "@/lib/apolloClient";
import {
  GET_SITE_NAME,
  GET_ATTENDANCE_CHECKPOINTS,
  GET_ATTENDANCE_HISTORY,
} from "@/graphql/queries/site";
import { GET_SHIFT_SETTINGS_BY_SITE_ID } from "@/graphql/queries/shiftRoster";

const useSiteStore = create((set, get) => ({
  fetch: false,
  loading: false,
  siteName: "",
  shiftSettings: null,
  shiftSettingsCount: 0,
  attendanceCheckpointCount: 0,
  attendanceCheckpoint: null,
  attendanceHistory: null,

  total: 0,
  pageCount: 0,

  QRProps: {
    locationName: null,
    code: null,
  },

  handleRefresh: () => {
    set({ fetch: uuid() });
  },

  setQRProps: (props) => {
    let QRInfo = {
      locationName: props?.Name,
      code: props?.QRcode?.data?.attributes,
    };

    set({ QRProps: QRInfo });
  },

  fetchSiteName: async (id) => {
    try {
      set({ loading: true });
      const { data } = await apolloClient.query({
        fetchPolicy: "network-only",
        query: GET_SITE_NAME,
        variables: {
          id: id,
        },
      });
      if (data) {
        set({ siteName: data?.site?.data?.attributes?.name, loading: false });
      }
    } catch (error) {
      set({ loading: false });
      console.log("error", error);
    }
  },

  fetchAttendCheckpointData: async ({ id }) => {
    set({ loading: true });

    const {
      data: { site: attendanceCheckpoint },
    } = await apolloClient.query({
      fetchPolicy: "network-only",
      query: GET_ATTENDANCE_CHECKPOINTS,
      variables: { id: parseInt(id) },
    });

    if (attendanceCheckpoint) {
      set({
        siteName: attendanceCheckpoint?.data?.attributes?.name,
        attendanceCheckpointCount:
          attendanceCheckpoint?.data?.attributes?.checkpoints?.length,
        attendanceCheckpoint:
          attendanceCheckpoint?.data?.attributes?.checkpoints,
        loading: false,
      });
    }
  },

  fetchAttendHistoryData: async ({ dutyDate, currentPage, pageSize }) => {
    try {
      set({ loading: true });
      const {
        data: { assignedRosters: attendanceHistory },
      } = await apolloClient.query({
        fetchPolicy: "network-only",
        query: GET_ATTENDANCE_HISTORY,
        variables: {
          dutyDate: dutyDate,
          pageNum: currentPage,
          pageSize: pageSize,
        },
      });

      const attendanceHistoryData = attendanceHistory.data.map((item) => {
        const profileData = item.attributes?.profile.data?.attributes;

        return {
          id: item.id,
          dutyDate: item.attributes.dutyDate,
          startTime: item.attributes.startTime,
          endTime: item.attributes.endTime,
          username: profileData.fullName,
          photo: profileData.photo.data?.attributes.url,
          shiftRoster: item.attributes.shiftRoster.data?.attributes.title,

          attendanceLogs: item.attributes?.attendanceLogs.data.map((item) => {
            return {
              dateAndTime: item.attributes?.dateAndTime,
              type: item.attributes?.type,
              remark: item.attributes?.notes,
            };
          }),
        };
      });

      set({
        attendanceHistory: attendanceHistoryData,
        total: attendanceHistory.meta?.pagination?.total,
        pageCount: attendanceHistory.meta?.pagination?.pageCount,
        loading: false,
      });
    } catch (error) {
      set({ loading: false });
      console.log("error", error);
    }
  },

  fetchShiftSettingBySiteId: async ({ id }) => {
    try {
      set({ loading: true });
      const { data } = await apolloClient.query({
        fetchPolicy: "network-only",
        query: GET_SHIFT_SETTINGS_BY_SITE_ID,
        variables: {
          siteId: id,
        },
      });
      if (data) {
        set({
          shiftSettings: data?.shiftRosters?.data,
          shiftSettingsCount: data?.shiftRosters?.meta?.pagination?.total,
          loading: false,
        });
      }
    } catch (error) {
      set({ loading: false });
      console.log("error", error);
    }
  },
}));

export default useSiteStore;
