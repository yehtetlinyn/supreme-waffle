"use client";
import React, { useEffect, useState, useMemo } from "react";
import AttendanceHistoryLists from "./list";
import ContentWrap from "@/components/contentWrap/page";
import Paginate from "@/components/pagination/page";
import dayjs from "dayjs";
import Loading from "@/components/modals/loading";
import { shallow } from "zustand/shallow";
import NoData from "@/components/noData/noData";
import useSiteStore from "@/store/siteStore";

const pageSize = 10;

const MangeAttendanceHistory = () => {
  const currentDate = dayjs().format("YYYY-MM-DD");

  const [currentPage, setCurrentPage] = useState(1);

  const {
    fetch,
    loading,
    total,
    pageCount,
    siteName,
    attendanceHistory,
    fetchAttendHistoryData,
  } = useSiteStore(
    (state) => ({
      fetch: state.fetch,
      loading: state.loading,
      total: state.total,
      pageCount: state.pageCount,
      siteName: state.siteName,
      attendanceHistory: state.attendanceHistory,
      fetchAttendHistoryData: state.fetchAttendHistoryData,
    }),
    shallow
  );

  useEffect(() => {
    fetchAttendHistoryData({
      dutyDate: currentDate,
      currentPage: currentPage,
      pageSize: pageSize,
    });
  }, [currentPage, fetch]);

  return (
    <>
      <ContentWrap
        content={
          loading || !attendanceHistory ? (
            <Loading />
          ) : attendanceHistory?.length > 0 ? (
            <AttendanceHistoryLists
              siteName={siteName}
              attendanceHistoryData={attendanceHistory}
            />
          ) : (
            <div>
              <NoData />
            </div>
          )
        }
        footer={
          <Paginate
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            pageCount={pageCount || 1}
          />
        }
        totalCount={total}
        showingCount={attendanceHistory?.length}
        loading={loading || !attendanceHistory}
      />
    </>
  );
};

export default MangeAttendanceHistory;
