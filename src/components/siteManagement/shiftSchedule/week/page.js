import BootstrapTable from "react-bootstrap-table-next";
import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import dayjs from "dayjs";
import shiftStyle from "../style.module.css";
import styles from "@/components/styles/commonStyles.module.css";
import { IoMdArrowDropup } from "react-icons/io";
import { useMutation } from "@apollo/client";
import apolloClient from "@/lib/apolloClient";
import { DELETE_ASSIGNED_ROSTER } from "@/graphql/mutations/shiftSchedule";

import ActionMenu from "@/components/base/actionMenu";
import TruncatedText from "@/components/base/truncatedText";
import NoData from "@/components/noData/noData";
import {
  daysInShort,
  timeRanges,
  getInitialStartingDay,
  renderNotifyRosterMsg,
} from "@/utils/data";
import {
  getCurrentWeekDates,
  getOrdinalSuffix,
  renderDate,
  checkWeekDays,
} from "@/utils/helpers";
import { API_URL } from "@/config";
import ShiftScheduleForm from "../manage/shiftForm";
import ShiftAssignUserModal from "../modals/page";
import usePageStore from "@/store/pageStore";
import useShiftScheduleStore from "@/store/shiftScheduleStore";
import ConfirmationModal from "@/components/modals/confirmation";
import Loading from "@/components/modals/loading";

const WeekShiftScheduleIndex = ({ startingDay, setStartingDay }) => {
  const params = useParams();
  const currentWeekDates = getCurrentWeekDates(startingDay);
  const initialStartingDay = getInitialStartingDay();

  const [assignUserModal, setAssignUserModal] = useState(false);
  const [dayIndex, setDayIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState({
    exclude: false,
    notifyExclude: false,
  });
  const [selectedShift, setSelectedShift] = useState({
    id: null,
    name: null,
    selectDays: null,
  });
  const [shiftTimeRange, setShiftTimeRange] = useState({
    startTime: "00:00:00.000",
    endTime: "00:00:00.000",
  });

  const toggleExcludeUsersModal = () => {
    setModalOpen({ exclude: !modalOpen.exclude });
  };
  const { modalId, selectedAccordion } = usePageStore((state) => ({
    modalId: state.modalId,
    selectedAccordion: state.selectedAccordion,
  }));

  const {
    fetch,
    loading,
    tableLoading,
    shiftRosters,
    shiftRostersData,
    numberOfHeads,
    headCountsData,
    rosterAssignedUsers,
    shiftRosterOptions,
    assignedRosterIds,
    getHeadCount,
    handleRefresh,
    getShiftAssignedUsers,
    getSiteShiftUsers,
    getAssignedCopyUsers,
    getAssignedRosterIds,
    getNextWeekAssignedRosterIds,
  } = useShiftScheduleStore((state) => ({
    fetch: state.fetch,
    loading: state.loading,
    tableLoading: state.tableLoading,
    shiftRosters: state.shiftRosters,
    shiftRostersData: state.shiftRostersData,
    numberOfHeads: state.numberOfHeads,
    headCountsData: state.headCountsData,
    rosterAssignedUsers: state.rosterAssignedUsers,
    shiftRosterOptions: state.shiftRosterOptions,
    assignedRosterIds: state.assignedRosterIds,
    getHeadCount: state.getHeadCount,
    handleRefresh: state.handleRefresh,
    getShiftAssignedUsers: state.getShiftAssignedUsers,
    getSiteShiftUsers: state.getSiteShiftUsers,
    getAssignedCopyUsers: state.getAssignedCopyUsers,
    getAssignedRosterIds: state.getAssignedRosterIds,
    getNextWeekAssignedRosterIds: state.getNextWeekAssignedRosterIds,
  }));

  function keepFirstOccurrenceOfDuplicates(array) {
    return [];
  }

  const duplicatedUser = keepFirstOccurrenceOfDuplicates(rosterAssignedUsers);

  const selectedTimeRange = timeRanges[selectedAccordion];

  const renderIsCurrentWeek = (index) => {
    const dayDate = renderDate(initialStartingDay, index);
    const startDate = dayjs(currentWeekDates.startDate);
    const endDate = dayjs(currentWeekDates.endDate);
    const isCurrentWeek =
      (dayjs(dayDate).isAfter(startDate) || dayjs(dayDate).isSame(startDate)) &&
      (dayjs(dayDate).isBefore(endDate) || dayjs(dayDate).isSame(endDate));

    return isCurrentWeek;
  };

  const [excludeAssignedUsersAction, { loading: excludeLoading }] = useMutation(
    DELETE_ASSIGNED_ROSTER,
    {
      client: apolloClient,
      onCompleted: (data) => {
        if (data) {
          if (assignedRosterIds.length > 0) {
            setModalOpen({ exclude: false, notifyExclude: true });
          } else {
            setModalOpen({ exclude: true, notifyExclude: false });
          }
          handleRefresh();
        }
      },
      onError: (error) => {
        console.log("error", error);
      },
    }
  );

  const handleExcludeAssignPerson = (index) => {
    setModalOpen({ exclude: true, notifyExclude: false });
    setDayIndex(index);
  };

  const handleExcludeAssignUsers = async () => {
    if (assignedRosterIds.length > 0) {
      try {
        await Promise.all(
          assignedRosterIds?.map(async (rosterId) => {
            await excludeAssignedUsersAction({
              variables: { assignedRosterId: rosterId },
            });
          })
        );
        getShiftAssignedUsers({
          siteId: siteId,
          startDate: currentWeekDates.startDate,
          endDate: currentWeekDates.endDate,
        });
      } catch (error) {
        console.log("error", error);
      }
    } else {
      setModalOpen({ exclude: false, notifyExclude: true });
    }
  };

  const renderExcludeConfirmMsg = () => {
    const date = dayjs(startingDay).add(dayIndex, "day");
    const dayOfMonth = date.format("D");
    const ordinalSuffix = getOrdinalSuffix(parseInt(dayOfMonth, 10));
    const formattedDate = date.format(`DD[${ordinalSuffix}] MMM YYYY`);

    let excludeConfirmMsg = (
      <>
        <div>
          {"Are you sure you want to exclude person assigned for"}
          <p style={{ color: "var(--primary-yellow)" }}>
            {`${formattedDate}`}{" "}
            <span style={{ color: "var(--primary-font)" }}>?</span>
          </p>
        </div>
      </>
    );

    return excludeConfirmMsg;
  };

  const handleAssignUserModal = (index) => {
    setAssignUserModal(true);
    setDayIndex(index);
  };

  const renderHeaderCell = (index, day) => {
    const date = dayjs(startingDay).add(index, "day");
    const weekDays = checkWeekDays(startingDay, index);
    const isCurrentWeek = renderIsCurrentWeek(index);
    const isActiveMenu =
      !weekDays.isPastDay &&
      !(isCurrentWeek && selecteDays && !selecteDays?.includes(day));

    return (
      <div key={index} className={shiftStyle.headerCellContent}>
        <div className={shiftStyle.leftContent}>{date.format("ddd, D")}</div>
        <div className={shiftStyle.rightContent}>
          {isActiveMenu && (
            <ActionMenu
              assignPerson={true}
              excludePerson={true}
              assignHandler={() => handleAssignUserModal(index)}
              excludeHandler={() => handleExcludeAssignPerson(index)}
            />
          )}

          {weekDays.isCurrentDay && (
            <div className={shiftStyle.fullContent}>
              <IoMdArrowDropup size={30} color="var(--primary-yellow)" />
            </div>
          )}
        </div>
      </div>
    );
  };

  const getFormattedDataForTable = (assignedRoster) => {
    // Create an object to organize assignments by date and user
    const assignmentsByDate = {};

    // Populate the assignmentsByDate object
    assignedRoster?.forEach((entry) => {
      const { dutyDate, username, photo } = entry;
      if (!assignmentsByDate[dutyDate]) {
        assignmentsByDate[dutyDate] = [];
      }
      assignmentsByDate[dutyDate].push({ username, photo });

      // Sort the assignments by username for each date
      assignmentsByDate[dutyDate].sort((a, b) =>
        a.username?.localeCompare(b.username)
      );
    });

    // Create an array for the table data
    const formattedData = [];

    // Loop through the table rows (staff members)
    for (let i = 1; i <= numberOfHeads.length; i++) {
      const staffMember = {
        staff: `Staff ${i}`,
      };

      // Loop through the table columns (dates)
      daysInShort.forEach((day) => {
        const dutyDate = renderDate(startingDay, daysInShort.indexOf(day));
        staffMember[day] = assignmentsByDate[dutyDate]?.[i - 1] || ""; // Assign user if available
      });

      formattedData.push(staffMember);
    }

    return formattedData;
  };

  const staffFormatter = (cell, row) => {
    return <div>{row.staff}</div>;
  };

  const dataFormatter = (index, cell, row, day) => {
    const avifImg = row[day]?.photo?.url?.endsWith(".avif");
    const profileImg = row[day]?.photo?.url;
    const username = row[day]?.username;

    const isCurrentWeek = renderIsCurrentWeek(index);
    const disabledCell =
      isCurrentWeek && selecteDays && !selecteDays?.includes(day);

    const cellStyle = disabledCell || profileImg;
    const weekDays = checkWeekDays(startingDay, index);
    const imageStyle = weekDays.isPastDay ? { opacity: 0.5 } : {};
    const textStyle = `${
      weekDays.isPastDay
        ? "var(--input-placeholder-text)"
        : "var(--primary-font)"
    }`;

    return (
      <div
        key={index}
        className={cellStyle ? shiftStyle.cell : shiftStyle.emptyCell}
      >
        {disabledCell ? (
          <div className={shiftStyle.disabledCell}></div>
        ) : (
          <div className={shiftStyle.profileImage}>
            {profileImg && !avifImg ? (
              <Image
                src={profileImg}
                width={150}
                height={100}
                alt={row[day]?.photo?.alt}
                className={shiftStyle.circularAvatar}
                style={imageStyle}
              />
            ) : (!profileImg && username) || (avifImg && username) ? (
              <Image
                src="/images/blank-profile-picture-geede3862d_1280.png"
                width={150}
                height={100}
                alt={"profile photo"}
                className={shiftStyle.circularAvatar}
                style={imageStyle}
              />
            ) : null}

            {username ? (
              <TruncatedText
                text={username}
                maxLength={6}
                customColor={textStyle}
              />
            ) : null}
          </div>
        )}
      </div>
    );
  };

  const siteId = params?.id;
  const shiftId = selectedShift.id ?? parseInt(shiftRosterOptions[0]?.id);
  const shiftName = selectedShift.name ?? shiftRosterOptions[0]?.label;
  const selecteDays =
    selectedShift.selectDays ?? shiftRosterOptions[0]?.selectDays;
  const assignedDate = renderDate(startingDay, dayIndex);
  const nextWeekAssignedDate = renderDate(startingDay, dayIndex + 7);
  const excludeConfirmMsg = renderExcludeConfirmMsg();
  const notifyRosterMsg = renderNotifyRosterMsg();

  const getColumns = () => {
    let columns = [
      {
        dataField: "",
        text: "Staff",
        formatter: staffFormatter,
        headerStyle: () => {
          return { width: "15%" };
        },
      },
      ...daysInShort.map((day, index) => ({
        dataField: day,
        text: day,
        key: day,
        style: { textAlign: "center" },

        headerStyle: () => {
          return { textAlign: "center" };
        },
        formatter: (cell, row) => dataFormatter(index, cell, row, day),
        headerFormatter: () => renderHeaderCell(index, day),
      })),
    ];

    return columns;
  };

  const handleSelectedShift = async (
    id,
    name,
    selectDays,
    startTime,
    endTime
  ) => {
    setSelectedShift({ id: id, name: name, selectDays: selectDays });
    setShiftTimeRange({ startTime: startTime, endTime: endTime });
  };

  useEffect(() => {
    getShiftAssignedUsers({
      siteId: siteId,
      startDate: currentWeekDates.startDate,
      endDate: currentWeekDates.endDate,
    });

    getAssignedCopyUsers({
      shiftId: shiftId || modalId,
      startDate: currentWeekDates.startDate,
      endDate: currentWeekDates.endDate,
    });
  }, [shiftId, currentWeekDates.startDate, currentWeekDates.endDate, fetch]);

  useEffect(() => {
    getHeadCount(shiftId || selectedAccordion);
  }, [shiftId, selectedAccordion]);

  useEffect(() => {
    getSiteShiftUsers(siteId);
  }, []);

  useMemo(() => {
    getAssignedRosterIds(shiftId, assignedDate);
  }, [shiftId, assignedDate, shiftRostersData]);

  useMemo(() => {
    getNextWeekAssignedRosterIds(shiftId, nextWeekAssignedDate);
  }, [shiftId, nextWeekAssignedDate, shiftRostersData]);

  return (
    <div className={shiftStyle.wrapper}>
      {loading || !shiftRostersData ? (
        <Loading />
      ) : shiftRosters.length === 0 ? (
        <NoData />
      ) : (
        shiftRosters.length > 0 &&
        shiftRosters?.map((shiftRoster) => {
          const {
            shiftRosterId: shiftId,
            title,
            repeatDays,
            startTime,
            endTime,
            timeRange,
            assignedRoster,
          } = shiftRoster;
          const formattedData = getFormattedDataForTable(assignedRoster);

          return (
            <ShiftScheduleForm
              key={shiftId}
              shiftId={shiftId}
              selectedShiftId={selectedShift.id}
              siteId={siteId}
              shiftName={title}
              selectDays={repeatDays}
              startTime={startTime}
              endTime={endTime}
              timeRange={timeRange}
              startingDay={startingDay}
              setStartingDay={setStartingDay}
              handleSelected={handleSelectedShift}
            >
              <div key={shiftId} className={shiftStyle.shiftScheduleContainer}>
                {tableLoading || !headCountsData ? (
                  <Loading />
                ) : numberOfHeads.length > 0 ? (
                  <BootstrapTable
                    bootstrap4
                    key={selectedShift.id}
                    keyField="assignedRosterId"
                    data={formattedData}
                    columns={getColumns()}
                    bordered={false}
                    wrapperClasses="table-responsive"
                    classes="table table-bordered custom-table"
                  />
                ) : (
                  <NoData />
                )}
              </div>
            </ShiftScheduleForm>
          );
        })
      )}

      <ShiftAssignUserModal
        assignByDay
        formParams={"shift-assign-user"}
        shiftId={shiftId}
        siteId={siteId}
        actionHeader={"Assign Person (By Day)"}
        actionType={"Continue"}
        isOpen={assignUserModal}
        toggle={() => setAssignUserModal(!assignUserModal)}
        setAssignUserModal={setAssignUserModal}
        startingDay={startingDay}
        shiftName={shiftName}
        startTime={shiftTimeRange.startTime}
        endTime={shiftTimeRange.endTime}
        dayIndex={dayIndex}
      />

      <ConfirmationModal
        isOpen={modalOpen.exclude}
        toggle={toggleExcludeUsersModal}
        modalTitle={"Exclude Assign Person"}
        modalMsg={excludeConfirmMsg}
        disabled={excludeLoading}
        handleClick={handleExcludeAssignUsers}
      />
      <ConfirmationModal
        isOpen={modalOpen.notifyExclude}
        toggle={() => setModalOpen({ notifyExclude: !modalOpen.notifyExclude })}
        modalTitle={"Exclude Assign Person"}
        modalMsg={notifyRosterMsg}
        actionBtns={false}
      />
    </div>
  );
};

export default WeekShiftScheduleIndex;
