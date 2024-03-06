import React, { useState, useEffect } from "react";
import { Form, Row, Col } from "reactstrap";
import { useForm } from "react-hook-form";
import { GoDotFill } from "react-icons/go";
import Image from "next/image";
import dayjs from "dayjs";
import { useMutation } from "@apollo/client";
import apolloClient from "@/lib/apolloClient";
import {
  UPDATE_ASSIGNED_ROSTER,
  CREATE_ASSIGNED_ROSTER,
  DELETE_ASSIGNED_ROSTER,
} from "@/graphql/mutations/shiftSchedule";

import shiftStyle from "../style.module.css";
import styles from "@/components/styles/commonStyles.module.css";
import ActionHandlerModal from "@/components/modals/actionHandler";
import TruncatedText from "@/components/base/truncatedText";
import NoData from "@/components/noData/noData";
import Loading from "@/components/modals/loading";
import usePageStore from "@/store/pageStore";
import useShiftScheduleStore from "@/store/shiftScheduleStore";
import {
  getOrdinalSuffix,
  renderDate,
  renderDay,
  getCurrentWeekDates,
} from "@/utils/helpers";
import { formatStringWithUnderscores } from "@/utils/stringUtils";

const ShiftAssignUserModal = ({
  formParams,
  siteId,
  shiftId,
  actionHeader,
  actionType,
  isOpen,
  toggle,
  setAssignUserModal,
  startingDay,
  shiftName,
  startTime,
  endTime,
  dayIndex,
  editAssignPerson,
  assignIndividual,
  assignByDay,
}) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const {
    siteUsersData,
    numberOfHeads,
    selectedUserIds,
    assignedRosterIds,
    handleRefresh,
    setSelectedUserIds,
    getShiftAssignedUsers,
  } = useShiftScheduleStore((state) => ({
    siteUsersData: state.siteUsersData,
    numberOfHeads: state.numberOfHeads,
    selectedUserIds: state.selectedUserIds,
    assignedRosterIds: state.assignedRosterIds,
    handleRefresh: state.handleRefresh,
    setSelectedUserIds: state.setSelectedUserIds,
    getShiftAssignedUsers: state.getShiftAssignedUsers,
  }));

  const date = dayjs(startingDay).add(dayIndex, "day");
  const dayOfMonth = date.format("D");
  const ordinalSuffix = getOrdinalSuffix(parseInt(dayOfMonth, 10));

  const formattedDate = date.format(`DD[${ordinalSuffix}] MMM YYYY / ddd`);
  const assignedDate = renderDate(startingDay, dayIndex);
  const assignedDay = renderDay(startingDay, dayIndex);
  const currentWeekDates = getCurrentWeekDates(startingDay);
  const limitCheck = selectedRows.length <= numberOfHeads.length;
  const singleSelectedUser =
    siteUsersData &&
    [selectedRows, selectedUserIds].some((arr) =>
      arr?.includes(siteUsersData[0]?.id)
    );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const [deleteAssignedRosterAction] = useMutation(DELETE_ASSIGNED_ROSTER, {
    client: apolloClient,
    onCompleted: (data) => {
      if (data) {
        handleRefresh();
        setAssignUserModal(false);
        setSelectedRows([]);
        setValue("reason", "");
      }
    },
    onError: (error) => {
      console.log("error", error);
    },
  });

  const [createAssignedRosterAction] = useMutation(CREATE_ASSIGNED_ROSTER, {
    client: apolloClient,
    onCompleted: (data) => {
      if (data) {
        handleRefresh();
        setAssignUserModal(false);
        setFormSubmitted(false);
        setSelectedRows([]);
        setValue("reason", "");
      }
    },
    onError: (error) => {
      console.log("error", error);
    },
  });

  const handleRowCheckSelect = (id) => {
    if (selectedUserIds.includes(id)) {
      setSelectedUserIds(selectedUserIds.filter((rowId) => rowId !== id));
    } else if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      if (selectedRows.length < numberOfHeads.length) {
        setSelectedRows([...selectedRows, id]);
      }
    }
  };

  const handleRowCheckSelected = (id, status) => {
    if (status !== "Taking_Leave") {
      handleRowCheckSelect(id);
    }
  };

  const renderStatusIcon = (colorStyle) => {
    return (
      <GoDotFill
        color={colorStyle}
        style={{ width: "20px", height: "20px", marginTop: "5px" }}
      />
    );
  };

  const renderShiftAssignUsers = (id, data) => {
    const { photo, username, email, position, status } = data;

    return (
      <>
        <div className={shiftStyle.checkWrapper}>
          <input
            type="checkbox"
            disabled={status === "Taking_Leave"}
            checked={selectedRows.includes(id) || selectedUserIds.includes(id)}
            onChange={() => handleRowCheckSelect(id)}
            {...register("selectedRows", { value: selectedRows })}
          />
          {(status !== "Taking_Leave" && (
            <label className={shiftStyle.checkboxLabel}></label>
          )) || <label className={shiftStyle.disabledCheckLabel}></label>}
        </div>

        <div>
          {photo?.url && !photo.url.endsWith(".avif") ? (
            <Image
              src={photo?.url}
              width={50}
              height={50}
              alt={`shift user ${id}`}
              className={shiftStyle.circularAvatar}
            />
          ) : (
            <Image
              src="/images/blank-profile-picture-geede3862d_1280.png"
              width={50}
              height={50}
              alt={`shift user ${id}`}
              className={shiftStyle.circularAvatar}
            />
          )}
        </div>
        <Row className={shiftStyle.assignUserContact}>
          <Col className={shiftStyle.alignStart}>
            {username ? (
              <TruncatedText text={username} maxLength={6} />
            ) : (
              <span className={shiftStyle.emptyData}>{"-"}</span>
            )}
          </Col>
          <Col className={shiftStyle.alignStart}>
            {username || email ? (
              <TruncatedText
                text={email}
                maxLength={6}
                customColor="var(--medium-gray)"
              />
            ) : null}
          </Col>
        </Row>
        <div className={shiftStyle.assignUserRole}>
          {position ? (
            <TruncatedText text={position} maxLength={12} />
          ) : (
            <span className={shiftStyle.emptyData}>{"-"}</span>
          )}
        </div>
        <div className={shiftStyle.assignUserStatus}>
          {status ? (
            <div className={shiftStyle.statusItems}>
              {status === "Over_Workload"
                ? renderStatusIcon("var(--text-orange")
                : status === "Taking_Leave"
                ? renderStatusIcon("var(--light-gray")
                : renderStatusIcon("var(--primary-green")}
              <div className={shiftStyle.alignStart}>
                {formatStringWithUnderscores(status)}
              </div>
            </div>
          ) : (
            <span className={shiftStyle.emptyData}>{"-"}</span>
          )}
        </div>
      </>
    );
  };

  const handleToggle = () => {
    selectedRows.length > 0 && setSelectedRows([]);
    setFormSubmitted(false);
    toggle();
  };

  const fetchShiftAssignedUsers = () => {
    getShiftAssignedUsers({
      siteId: siteId,
      startDate: currentWeekDates.startDate,
      endDate: currentWeekDates.endDate,
    });
  };

  const handleDeleteAssign = async () => {
    try {
      await Promise.all(
        assignedRosterIds?.map(async (rosterId) => {
          await deleteAssignedRosterAction({
            variables: { assignedRosterId: rosterId },
          });
        })
      );
      fetchShiftAssignedUsers();
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleCreateAssign = async (data) => {
    const { selectedRows, reason } = data;

    try {
      await Promise.all(
        selectedRows?.map(async (selectedId) => {
          await createAssignedRosterAction({
            variables: {
              data: {
                shiftRoster: shiftId,
                dutyDate: assignedDate,
                dutyDay: assignedDay,
                startTime: startTime,
                endTime: endTime,
                remark: reason,
                profile: selectedId,
              },
            },
          });
        })
      );
      fetchShiftAssignedUsers();
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleProceedAssign = async (data) => {
    setFormSubmitted(true);
    await handleDeleteAssign();
    await handleCreateAssign(data);
  };

  return (
    <ActionHandlerModal
      enableModalHeader
      enableModalFooter
      formParams={formParams}
      actionType={actionType}
      actionHeader={actionHeader}
      isOpen={isOpen}
      disabled={formSubmitted || selectedRows.length === 0}
      toggle={handleToggle}
    >
      <Form
        id={formParams}
        role="form"
        onSubmit={handleSubmit(handleProceedAssign)}
        className={styles.formWrapper}
      >
        <div className={shiftStyle.assignUserStatus}>
          <div className={shiftStyle.timeline}>
            <div className={shiftStyle.statusItems}>
              {shiftName ? shiftName : "-"}
              <div className={shiftStyle.alignStart}>
                {` - ${formattedDate}`}
              </div>
            </div>
          </div>
        </div>

        <div className={shiftStyle.optionsWrapper}>
          <label className={`mt-0 mb-3 ${shiftStyle.timeline}`}>
            Assign Person
          </label>
          <div className={shiftStyle.optionsGroup}>
            <div
              className={`m-0 ${shiftStyle.optionColumn} ${shiftStyle.label}`}
            >
              Show Selected ({selectedRows.length}/{numberOfHeads.length})
            </div>
          </div>
        </div>

        {siteUsersData?.length === 1 ? (
          <div
            onClick={() =>
              handleRowCheckSelected(
                siteUsersData[0]?.id,
                siteUsersData[0]?.status
              )
            }
            className={`${shiftStyle.assignUserRow} ${
              limitCheck &&
              siteUsersData[0]?.status !== "Taking_Leave" &&
              singleSelectedUser &&
              shiftStyle.selectedRow
            } `}
          >
            {renderShiftAssignUsers(siteUsersData[0]?.id, siteUsersData[0])}
          </div>
        ) : siteUsersData?.length > 1 ? (
          siteUsersData?.map((item, index) => {
            const multiSelectedUsers = [selectedRows, selectedUserIds].some(
              (arr) => arr?.includes(item?.id)
            );

            return (
              <div
                key={index}
                onClick={() => handleRowCheckSelected(item.id, item.status)}
                className={`${shiftStyle.assignUserRow} ${
                  limitCheck &&
                  item?.status !== "Taking_Leave" &&
                  multiSelectedUsers &&
                  shiftStyle.selectedRow
                }`}
              >
                {renderShiftAssignUsers(item.id, item)}
              </div>
            );
          })
        ) : null}

        {(siteUsersData?.length > 0 && (
          <div className={`d-flex flex-column ${styles.formGroup}`}>
            <div className={shiftStyle.optionsWrapper}>
              <label className={shiftStyle.label}>Reason</label>
            </div>
            <textarea
              rows={"3"}
              id={"reason"}
              {...register("reason")}
              maxLength={255}
              disabled={selectedRows.length === 0}
              className={styles.formInputBox}
            />
          </div>
        )) || <NoData />}
      </Form>
    </ActionHandlerModal>
  );
};

export default ShiftAssignUserModal;
