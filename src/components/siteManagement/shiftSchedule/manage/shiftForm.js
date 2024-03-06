import React, { useState, useEffect } from "react";
import { Collapse } from "reactstrap";
import {
  IoIosArrowDropdownCircle,
  IoIosArrowDropupCircle,
} from "react-icons/io";
import shiftStyle from "../style.module.css";
import styles from "@/components/styles/commonStyles.module.css";
import siteStyle from "@/components/siteManagement/site.module.css";
import ActionMenu from "@/components/base/actionMenu";
import useShiftScheduleStore from "@/store/shiftScheduleStore";
import usePageStore from "@/store/pageStore";
import ConfirmationModal from "@/components/modals/confirmation";
import { renderDate, renderDay } from "@/utils/helpers";

import { useMutation } from "@apollo/client";
import {
  CREATE_ASSIGNED_ROSTER,
  DELETE_ASSIGNED_ROSTER,
} from "@/graphql/mutations/shiftSchedule";
import apolloClient from "@/lib/apolloClient";
import { renderNotifyRosterMsg } from "@/utils/data";
import { getCurrentWeekDates } from "@/utils/helpers";
import { addDays } from "date-fns";
import dayjs from "dayjs";

const ShiftScheduleForm = ({
  children,

  shiftId,
  siteId,
  selectedShiftId,
  shiftName,
  selectDays,
  startTime,
  endTime,
  timeRange,
  startingDay,
  setStartingDay,
  handleSelected,
}) => {
  const currentWeekDates = getCurrentWeekDates(startingDay);

  const [isCopying, setIsCopying] = useState(false);
  const [modalOpen, setModalOpen] = useState({
    copy: false,
    delete: false,
    notifyCopy: false,
    notifyDelete: false,
  });

  const { modalId, selectedAccordion, setModalId, setSelectedAccordion } =
    usePageStore((state) => ({
      modalId: state.modalId,
      selectedAccordion: state.selectedAccordion,
      setModalId: state.setModalId,
      setSelectedAccordion: state.setSelectedAccordion,
    }));
  const {
    copyAssignedUsers,
    shiftRosterOptions,
    currentAssignedRosterIds,
    nextWeekAssignedRosterIds,
    getShiftAssignedUsers,
    handleRefresh,
    resetCopyAssignedUsers,
  } = useShiftScheduleStore((state) => ({
    copyAssignedUsers: state.copyAssignedUsers,
    shiftRosterOptions: state.shiftRosterOptions,
    currentAssignedRosterIds: state.currentAssignedRosterIds,
    nextWeekAssignedRosterIds: state.nextWeekAssignedRosterIds,
    getShiftAssignedUsers: state.getShiftAssignedUsers,
    handleRefresh: state.handleRefresh,
    resetCopyAssignedUsers: state.resetCopyAssignedUsers,
  }));

  const handleForwardNextWeek = () => {
    setStartingDay((prevStartingDay) => prevStartingDay?.add(7, "day"));
  };

  const [createAssignedRosterAction] = useMutation(CREATE_ASSIGNED_ROSTER, {
    client: apolloClient,
    onCompleted: (data) => {
      if (data) {
        if (copyAssignedUsers.length > 0) {
          setModalOpen({ copy: false, notifyCopy: true });
        } else {
          setModalOpen({ copy: true, notifyCopy: false });
        }

        handleForwardNextWeek();
        handleRefresh();
      }
    },
    onError: (error) => {
      console.log("error", error);
    },
  });

  const [deleteAssignedRosterAction] = useMutation(DELETE_ASSIGNED_ROSTER, {
    client: apolloClient,
    onCompleted: (data) => {
      if (data) {
        handleRefresh();
        if (currentAssignedRosterIds.length > 0) {
          setModalOpen({ delete: false, notifyDelete: true });
        } else {
          setModalOpen({ delete: true, notifyDelete: false });
        }
      }
    },
    onError: (error) => {
      console.log("error", error);
    },
  });

  const fetchShiftAssignedUsers = () => {
    getShiftAssignedUsers({
      siteId: siteId,
      startDate: currentWeekDates.startDate,
      endDate: currentWeekDates.endDate,
    });
  };

  // copy schedule handler
  const handleCopyScheduleModalOpen = (e) => {
    e.stopPropagation();
    setModalId(shiftId);
    setModalOpen({ copy: !modalOpen.copy });
  };
  const renderCopyConfirmMsg = () => {
    let copyConfirmMsg = (
      <>
        <div className="text-start">
          You are about to copy this week's schedule entries for all team
          members to next week. It will not affect the entries that have already
          been filled in.
          <p className="mt-4">Do you want to confirm your action ?</p>
        </div>
      </>
    );

    return copyConfirmMsg;
  };
  const handleDeleteAssign = async () => {
    if (nextWeekAssignedRosterIds.length > 0) {
      try {
        await Promise.all(
          nextWeekAssignedRosterIds?.map(async (rosterId) => {
            await deleteAssignedRosterAction({
              variables: { assignedRosterId: rosterId },
            });
          })
        );
        fetchShiftAssignedUsers();
      } catch (error) {
        console.log("error", error);
      }
    }
  };
  const handleCopySchedule = async () => {
    if (copyAssignedUsers.length > 0) {
      setIsCopying(true);
      for (let i = 0; i < copyAssignedUsers.length; i++) {
        try {
          await createAssignedRosterAction({
            variables: {
              data: {
                startTime: copyAssignedUsers[i]?.startTime,
                endTime: copyAssignedUsers[i]?.endTime,
                profile: copyAssignedUsers[i]?.userId,
                shiftRoster: copyAssignedUsers[i]?.shiftId || modalId,
                dutyDate: renderDate(copyAssignedUsers[i]?.dutyDate, 7),
                dutyDay: renderDay(copyAssignedUsers[i]?.dutyDate, 7),
              },
            },
          });
          fetchShiftAssignedUsers();
        } catch (error) {
          console.log("error", error);
        }
        setIsCopying(false);
      }
    } else {
      setModalOpen({ copy: false, notifyCopy: true });
    }
  };
  const handleProceedCopySchedule = async () => {
    await handleDeleteAssign();
    await handleCopySchedule();
  };

  // delete schedule handler
  const handleDeleteScheduleModalOpen = (e) => {
    e.stopPropagation();
    setModalOpen({ delete: !modalOpen.delete });
  };
  const renderDeleteConfirmMsg = () => {
    let deleteConfirmMsg = (
      <>
        <div>
          {"Are you sure you want to delete schedule for"}
          <p style={{ color: "var(--primary-yellow)" }}>
            {`${shiftName}`}{" "}
            <span style={{ color: "var(--primary-font)" }}>?</span>
          </p>
        </div>
      </>
    );

    return deleteConfirmMsg;
  };
  const handleDeleteSchedule = async (e) => {
    // e.stopPropagation();
    if (currentAssignedRosterIds.length > 0) {
      try {
        await Promise.all(
          currentAssignedRosterIds?.map(async (rosterId) => {
            await deleteAssignedRosterAction({
              variables: { assignedRosterId: rosterId },
            });
          })
        );
        fetchShiftAssignedUsers();
      } catch (error) {
        console.log("error", error);
      }
    } else {
      setModalOpen({ delete: false, notifyDelete: true });
    }
  };

  const isSelectedShift =
    selectedShiftId || selectedAccordion > 0
      ? shiftId === selectedAccordion
      : shiftId?.includes(parseInt(shiftRosterOptions[0]?.id));
  const copyConfirmMsg = renderCopyConfirmMsg();
  const deleteConfirmMsg = renderDeleteConfirmMsg();
  const notifyRosterMsg = renderNotifyRosterMsg();

  return (
    <>
      <section className={shiftStyle.sectionWrapper}>
        <div className={shiftStyle.collapseWrapper}>
          <div
            style={{ marginBottom: "0" }}
            className={
              isSelectedShift
                ? shiftStyle.collapsedOpen
                : shiftStyle.collapsedClosed
            }
          >
            <div className={siteStyle.collapseContentOpen}>
              <div
                onClick={() => {
                  // isSelectedShift && resetCopyAssignedUsers();
                  setSelectedAccordion(isSelectedShift ? null : shiftId);
                  handleSelected(
                    shiftId,
                    shiftName,
                    selectDays,
                    startTime,
                    endTime
                  );
                }}
                className={`${siteStyle.collapse} ${styles.pointer}`}
              >
                <p className="me-auto" style={{ marginLeft: "1rem" }}>
                  <span className="me-2">{shiftName}</span>
                  <span className="me-2">{timeRange}</span>
                </p>

                <span>
                  {isSelectedShift ? (
                    <IoIosArrowDropupCircle
                      color="var(--primary-yellow)"
                      size={30}
                    />
                  ) : (
                    <IoIosArrowDropdownCircle
                      color="var(--primary-yellow)"
                      size={30}
                    />
                  )}
                </span>
                <ActionMenu
                  copyShfitSchedule={true}
                  deleteShiftSchedule={true}
                  copyScheduleHandler={handleCopyScheduleModalOpen}
                  deleteSchedueHander={handleDeleteScheduleModalOpen}
                />
              </div>
            </div>

            <Collapse isOpen={isSelectedShift}>
              <div className={siteStyle.collapseContentWrapper}>{children}</div>
            </Collapse>
          </div>
        </div>
      </section>

      <ConfirmationModal
        enableModalFooter
        isOpen={modalOpen.copy}
        toggle={() => setModalOpen({ copy: !modalOpen.copy })}
        id={shiftId}
        disabled={isCopying}
        modalTitle={"Copy Schedule"}
        modalMsg={copyConfirmMsg}
        handleClick={handleProceedCopySchedule}
        actionBtnProps={"Continue"}
      />
      <ConfirmationModal
        isOpen={modalOpen.notifyCopy}
        toggle={() => setModalOpen({ notifyCopy: !modalOpen.notifyCopy })}
        modalTitle={"Copy Schedule"}
        modalMsg={notifyRosterMsg}
        actionBtns={false}
      />

      <ConfirmationModal
        isOpen={modalOpen.delete}
        toggle={() => setModalOpen({ delete: !modalOpen.delete })}
        modalTitle={"Delete Schedule"}
        modalMsg={deleteConfirmMsg}
        handleClick={handleDeleteSchedule}
        actionBtnProps={"Delete"}
      />
      <ConfirmationModal
        isOpen={modalOpen.notifyDelete}
        toggle={() => setModalOpen({ notifyDelete: !modalOpen.notifyDelete })}
        modalTitle={"Delete Schedule"}
        modalMsg={notifyRosterMsg}
        actionBtns={false}
      />
    </>
  );
};

export default ShiftScheduleForm;
