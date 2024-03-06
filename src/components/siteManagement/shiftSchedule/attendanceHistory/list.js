"use client";
import BootstrapTable from "react-bootstrap-table-next";
import Image from "next/image";
import { API_URL } from "@/config";

import CustomTooltip from "@/components/base/customTooltip";
import styles from "@/components/styles/commonStyles.module.css";
import tableStyle from "./attendance.module.css";
import shiftStyle from "../style.module.css";
import {
  renderFormatTime,
  renderFormatLocalTime,
  checkTimeLimit,
} from "@/utils/helpers";
import { renderCustomSortIcon } from "@/components/base/customSortIcon";

const UPLOAD_URL = `${API_URL}/api/upload-url/get-upload-urls`;

const AttendanceHistoryLists = ({ siteName, attendanceHistoryData }) => {
  const customHeaderFormatter = (column, colIndex, components) => {
    return (
      <div className="d-flex justify-content-between align-items-center">
        {column.text} {components.sortElement}
      </div>
    );
  };

  const profileFormatter = async (cell, row, rowIndex) => {
    const data = { urls: [row?.photo] };
    const response = await fetch(UPLOAD_URL, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    });
    const json = await response.json();

    return (
      <div className={shiftStyle.assignUserStatus}>
        {row?.username || !json?.data ? (
          <div className={shiftStyle.statusItems}>
            {row?.photo && !row?.photo.endsWith(".avif") ? (
              <Image
                src={json?.data[0]}
                width={50}
                height={50}
                alt={`attendance history ${rowIndex}`}
                className={shiftStyle.circularAvatar}
              />
            ) : (
              <Image
                src="/images/blank-profile-picture-geede3862d_1280.png"
                width={50}
                height={50}
                alt={`attendance history ${rowIndex}`}
                className={shiftStyle.circularAvatar}
              />
            )}
            <div className={shiftStyle.alignStart}>{row?.username}</div>
          </div>
        ) : (
          <span className={shiftStyle.emptyData}>{"-"}</span>
        )}
      </div>
    );
  };

  const notifyFormatter = (cell, row, rowIndex) => {
    const limitCheckIn = checkTimeLimit(
      row?.attendanceLogs[0]?.dateAndTime,
      "checkIn"
    );
    const limitCheckOut = checkTimeLimit(
      row?.attendanceLogs[1]?.dateAndTime,
      "checkOut"
    );
    const limitCondition =
      limitCheckIn.earlyCondition ||
      limitCheckIn.lateCondition ||
      limitCheckOut.earlyCondition ||
      limitCheckOut.lateCondition;
    const tooltipMsg = limitCheckIn.earlyCondition
      ? "We noticed this worker checked in early."
      : limitCheckIn.lateCondition
      ? "We noticed this worker checked in late. Please ensure this worker's smooth transition and offer any assistance they might need to settle in comfortably."
      : limitCheckOut.earlyCondition
      ? "We noticed this worker checked out early."
      : "This worker is checking out early. Offer any assistance needed for a seamless departure.";

    return (
      <div className={tableStyle.titleContainer}>
        {limitCondition && (
          <CustomTooltip errorInfo tooltipId={rowIndex} placement="bottom">
            {tooltipMsg}
          </CustomTooltip>
        )}
      </div>
    );
  };

  const columns = [
    {
      dataField: "notified",
      text: "",
      headerStyle: { width: "3%", textAlign: "left" },
      style: { textAlign: "center" },
      formatter: notifyFormatter,
    },
    {
      dataField: "name",
      text: "Name",
      headerStyle: { width: "15%" },
      headerFormatter: customHeaderFormatter,
      sort: true,
      sortCaret: (order, column) => renderCustomSortIcon(order, column),
      formatter: profileFormatter,
    },
    {
      dataField: "shiftRoster",
      text: "Shift",
      headerStyle: { width: "15%" },
      headerFormatter: customHeaderFormatter,
      sort: true,
      sortCaret: (order, column) => renderCustomSortIcon(order, column),
    },
    {
      dataField: "dutyDate",
      text: "Date",
      headerStyle: { width: "10%" },
      headerFormatter: customHeaderFormatter,
      sort: true,
      sortCaret: (order, column) => renderCustomSortIcon(order, column),
    },
    {
      dataField: "dutyTime",
      text: "Duty Time",
      headerStyle: { width: "10%" },
      headerFormatter: customHeaderFormatter,
      sort: true,
      sortCaret: (order, column) => renderCustomSortIcon(order, column),
      formatter: (cell, row, rowIndex) => {
        const startTime = renderFormatTime(row?.startTime);
        const endTime = renderFormatTime(row?.endTime);

        return (
          <div key={rowIndex} className={tableStyle.titleContainer}>
            {`${startTime} - ${endTime}`}
          </div>
        );
      },
    },
    {
      dataField: "checkInTime",
      text: "Check In Time",
      headerStyle: { width: "15%" },
      headerFormatter: customHeaderFormatter,
      sort: true,
      sortCaret: (order, column) => renderCustomSortIcon(order, column),
      formatter: (cell, row, rowIndex) => {
        const checkIn = row?.attendanceLogs[0]?.dateAndTime;
        const limit = checkTimeLimit(checkIn, "checkIn");
        const checkInTime = checkIn ? renderFormatLocalTime(checkIn) : "-";
        const limitCondition = limit.earlyCondition || limit.lateCondition;

        return (
          <div key={rowIndex} className={tableStyle.titleContainer}>
            <span className={`${limitCondition && tableStyle.redText}`}>
              {checkInTime}
            </span>
          </div>
        );
      },
    },
    {
      dataField: "checkOutTime",
      text: "Check Out Time",
      headerStyle: { width: "15%" },
      headerFormatter: customHeaderFormatter,
      sort: true,
      sortCaret: (order, column) => renderCustomSortIcon(order, column),
      formatter: (cell, row, rowIndex) => {
        const checkOut = row?.attendanceLogs[1]?.dateAndTime;
        const limit = checkTimeLimit(checkOut, "checkOut");
        const checkOutTime = checkOut ? renderFormatLocalTime(checkOut) : "-";
        const limitCondition = limit.earlyCondition || limit.lateCondition;

        return (
          <div key={rowIndex} className={tableStyle.titleContainer}>
            <span className={`${limitCondition && tableStyle.redText}`}>
              {checkOutTime}
            </span>
          </div>
        );
      },
    },
    {
      dataField: "remark",
      text: "Remark",
      headerStyle: { width: "30%" },
      formatter: (cell, row, rowIndex) => {
        const checkInRemark = row?.attendanceLogs[0]?.remark;
        const checkOutRemark = row?.attendanceLogs[1]?.remark;

        const renderRemark = () => {
          if (checkInRemark && checkOutRemark) {
            return (
              <span className={tableStyle.redText}>
                {checkInRemark} / {checkOutRemark}
              </span>
            );
          } else if (checkInRemark && !checkOutRemark) {
            return <span className={tableStyle.redText}>{checkInRemark}</span>;
          } else if (!checkInRemark && checkOutRemark) {
            return <span className={tableStyle.redText}>{checkOutRemark}</span>;
          } else {
            return "-";
          }
        };

        return (
          <div key={rowIndex} className={tableStyle.titleContainer}>
            {renderRemark()}
          </div>
        );
      },
    },
  ];

  return (
    <>
      <div className={styles.tableWrapper}>
        <BootstrapTable
          bootstrap4
          key={siteName}
          keyField="id"
          columns={columns}
          data={attendanceHistoryData || []}
          bordered={false}
          selectRow={undefined}
        />
      </div>
    </>
  );
};

export default AttendanceHistoryLists;
