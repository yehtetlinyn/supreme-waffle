"use client";
import manageStyle from "../style.module.css";
import AttendanceHistoryHeader from "./header";
import MangeAttendanceHistory from "./table";

const AttendanceHistoryIndex = () => {
  return (
    <div
      className={manageStyle.sectionContainer}
      style={{ background: "none" }}
    >
      <AttendanceHistoryHeader />
      <MangeAttendanceHistory />
    </div>
  );
};

export default AttendanceHistoryIndex;
