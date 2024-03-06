import { create } from "zustand";
import { produce } from "immer";
import { v4 as uuid } from "uuid";
import dayjs from "dayjs";
import apolloClient from "@/lib/apolloClient";
import {
  GET_SITE_USERS,
  GET_SHIFT_ASSIGNED_USERS,
  GET_ASSIGNED_ROSTER_IDS,
  GET_ASSIGNED_ROSTER,
} from "@/graphql/queries/shiftSchedule";
import { GET_HEAD_COUNT_BY_SHIFT_ID } from "@/graphql/queries/shiftRoster";

const storeState = {
  loading: false,
  tableLoading: false,

  numberOfHeads: "",

  fetch: null,
  shiftRostersData: null,
  headCountsData: null,
  siteUsersData: null,

  rosterAssignedUsers: [],
  copyAssignedUsers: [],
  shiftRosters: [],
  assignedRosterIds: [],
  selectedUserIds: [],
  currentAssignedRosterIds: [],
  nextWeekAssignedRosterIds: [],
  shiftRosterOptions: [],
};

const shiftScheduleStore = (set, get) => ({
  ...storeState,

  handleRefresh: () => set({ fetch: uuid() }),

  setSelectedUserIds: (userIds) => set({ selectedUserIds: userIds }),

  getShiftAssignedUsers: async ({ siteId, startDate, endDate }) => {
    try {
      set({ loading: true });

      let shiftAssignsFilters = { site: { id: { eq: parseInt(siteId) } } };
      let assignRostersFilters = {
        dutyDate: { between: [startDate, endDate] },
      };

      const {
        data: { shiftRosters },
      } = await apolloClient.query({
        fetchPolicy: "network-only",
        query: GET_SHIFT_ASSIGNED_USERS,
        variables: { filters: shiftAssignsFilters },
        assignedRostersInput: assignRostersFilters,
      });

      const shiftRosterOptions = shiftRosters?.data?.map((data) => {
        const startTime = data.attributes?.timeRange?.StartTime;
        const endTime = data.attributes?.timeRange?.EndTime;

        return {
          id: data.id,
          value: `${startTime} - ${endTime}`,
          label: data?.attributes.title,
          selectDays: data?.attributes?.repeatDays,
        };
      });

      const renderTimeRange = (startTime, endTime) => {
        const initialTime = "00:00:00.000";

        if (startTime && endTime) {
          return `(${startTime} - ${endTime})`;
        } else if (startTime && !endTime) {
          return `(${startTime} - ${initialTime})`;
        } else if (!startTime && endTime) {
          return `(${initialTime} - ${endTime})`;
        } else {
          return `${initialTime} - ${initialTime}`;
        }
      };

      const shiftRostersData = shiftRosters?.data?.map((data) => {
        const startTime = data.attributes?.timeRange?.StartTime;
        const endTime = data.attributes?.timeRange?.EndTime;

        return {
          shiftRosterId: data?.id,
          title: data?.attributes?.title,
          repeatDays: data?.attributes?.repeatDays,
          startTime: startTime,
          endTime: endTime,
          timeRange: renderTimeRange(startTime, endTime),
          headCounts: data?.attributes?.numberOfHeads,

          assignedRoster: data?.attributes?.assignedRosters?.data?.map(
            (assignRoster, index) => {
              const profileData = assignRoster?.attributes?.profile;

              return {
                staff: `Staff ${index + 1}`,
                assignedRosterId: assignRoster?.id,
                dutyDate: assignRoster?.attributes?.dutyDate,
                dutyDay: assignRoster?.attributes?.dutyDay,

                userId: profileData?.data?.id,
                username: profileData?.data?.attributes?.fullName,
                status: profileData?.data?.attributes?.status,
                email: profileData?.data?.attributes?.email,
                position:
                  profileData?.data?.attributes?.position?.data?.attributes
                    ?.name,
                photo: {
                  url: profileData?.data?.attributes?.photo?.data?.attributes
                    ?.url,
                  alt:
                    profileData?.data?.attributes?.photo?.data?.attributes
                      ?.alternativeText || "profile photo",
                },
              };
            }
          ),
        };
      });

      set({
        shiftRosters: shiftRostersData,
        shiftRostersData: shiftRostersData,
        shiftRosterOptions: shiftRosterOptions,
        loading: false,
      });
    } catch (error) {
      set({ loading: false });
      console.log("error", error);
    }
  },

  getAssignedCopyUsers: async ({ shiftId, startDate, endDate }) => {
    try {
      set({ loading: true });

      let filters = {
        and: [
          { shiftRoster: { id: { eq: shiftId } } },
          { dutyDate: { between: [startDate, endDate] } },
        ],
      };
      const {
        data: { assignedRosters: assignedRosters },
      } = await apolloClient.query({
        fetchPolicy: "network-only",
        query: GET_ASSIGNED_ROSTER,
        variables: { filters: filters },
      });

      const copyAssignedUsers = assignedRosters?.data?.map((roster) => {
        return {
          assignedRosterId: roster.id,
          dutyDate: roster.attributes.dutyDate,
          dutyDay: roster.attributes.dutyDay,
          startTime: roster.attributes.startTime,
          endTime: roster.attributes.endTime,

          userId: roster.attributes?.profile?.data.id,
          shiftId: roster.attributes?.shiftRoster?.data.id,
        };
      });

      const assignedRosterIds = copyAssignedUsers?.map(
        (item) => item.assignedRosterId
      );

      set({
        copyAssignedUsers: copyAssignedUsers,
        currentAssignedRosterIds: assignedRosterIds,
        loading: false,
      });
    } catch (error) {
      set({ loading: false });
      console.log("error", error);
    }
  },

  getNextWeekAssignedRosterIds: async (shiftId, nextWeekAssignedDate) => {
    try {
      let filters = {
        and: [
          { shiftRoster: { id: { eq: shiftId } } },
          { dutyDate: { eq: nextWeekAssignedDate } },
        ],
      };

      const {
        data: { assignedRosters },
      } = await apolloClient.query({
        fetchPolicy: "network-only",
        query: GET_ASSIGNED_ROSTER_IDS,
        variables: { filters: filters },
      });

      const nextWeekAssignedIds = assignedRosters?.data?.map((roster) => {
        return {
          assignedRosterId: roster?.id,
        };
      });

      const nextWeekAssignedRosterIds = nextWeekAssignedIds?.map(
        (item) => item.assignedRosterId
      );

      set({ nextWeekAssignedRosterIds: nextWeekAssignedRosterIds });
    } catch (error) {
      console.log("error", error);
    }
  },

  getAssignedRosterIds: async (shiftId, assignedDate) => {
    try {
      let filters = {
        and: [
          { shiftRoster: { id: { eq: shiftId } } },
          { dutyDate: { eq: assignedDate } },
        ],
      };

      const {
        data: { assignedRosters },
      } = await apolloClient.query({
        fetchPolicy: "network-only",
        query: GET_ASSIGNED_ROSTER_IDS,
        variables: { filters: filters },
      });

      const assignedIds = assignedRosters?.data?.map((roster) => {
        return {
          assignedRosterId: roster?.id,
          userId: roster.attributes?.profile?.data.id,
        };
      });

      const assignedRosterIds = assignedIds?.map(
        (item) => item.assignedRosterId
      );

      const selectedUserIds = assignedIds?.map((item) => item.userId);

      set({
        assignedRosterIds: assignedRosterIds,
        selectedUserIds: selectedUserIds,
      });
    } catch (error) {
      console.log("error", error);
    }
  },

  getSiteShiftUsers: async (siteId) => {
    try {
      let filters = { sites: { id: { eq: parseInt(siteId) } } };

      const {
        data: { profiles: siteUsers },
      } = await apolloClient.query({
        fetchPolicy: "network-only",
        query: GET_SITE_USERS,
        variables: { filters: filters },
      });

      const siteUsersData = siteUsers.data.map((item) => {
        return {
          id: item.id,
          username: item.attributes?.fullName,
          status: item.attributes?.status,
          email: item.attributes?.email,
          position: item.attributes?.position.data?.attributes?.name,
          photo: {
            url: item.attributes?.photo.data?.attributes?.url,
            alt:
              item.attributes?.photo.data?.attributes?.alternativeText ||
              "profile photo",
          },
        };
      });

      set({ siteUsersData: siteUsersData });
    } catch (error) {
      console.log("error", error);
    }
  },

  getHeadCount: async (shiftId) => {
    try {
      set({ tableLoading: true });

      let filters = { id: { eq: parseInt(shiftId) } };

      const {
        data: { shiftRosters },
      } = await apolloClient.query({
        fetchPolicy: "network-only",
        query: GET_HEAD_COUNT_BY_SHIFT_ID,
        variables: { filters: filters },
      });

      const headCount = [];
      shiftRosters?.data?.map((data, index) => {
        for (let i = 1; i <= data?.attributes?.numberOfHeads; i++) {
          headCount.push(`Staff ${i}`);
        }
      });

      set({
        numberOfHeads: headCount,
        headCountsData: headCount,
        tableLoading: false,
      });
    } catch (error) {
      set({ tableLoading: false });
      console.log("error", error);
    }
  },

  resetCopyAssignedUsers: () => {
    set(
      produce((draft) => {
        draft.copyAssignedUsers = [];
      })
    );
  },
});

const useShiftScheduleStore = create(shiftScheduleStore);
export default useShiftScheduleStore;
