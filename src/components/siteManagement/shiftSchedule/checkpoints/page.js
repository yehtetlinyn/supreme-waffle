"use client";
import React, { useEffect, useState, useMemo } from "react";
import CheckpointsLists from "./list";
import ContentWrap from "@/components/contentWrap/page";
import Paginate from "@/components/pagination/page";
import { useParams } from "next/navigation";
import Loading from "@/components/modals/loading";
import { shallow } from "zustand/shallow";
import NoData from "@/components/noData/noData";
import useSiteStore from "@/store/siteStore";

const pageSize = 10;

const CheckpointsIndex = () => {
  const params = useParams();

  const [currentPage, setCurrentPage] = useState(1);

  const {
    loading,
    fetch,
    siteName,
    attendanceCheckpoint,
    attendanceCheckpointCount,
    fetchAttendCheckpointData,
  } = useSiteStore(
    (state) => ({
      loading: state.loading,
      fetch: state.fetch,
      siteName: state.siteName,
      attendanceCheckpoint: state.attendanceCheckpoint,
      attendanceCheckpointCount: state.attendanceCheckpointCount,
      fetchAttendCheckpointData: state.fetchAttendCheckpointData,
    }),
    shallow
  );

  useEffect(() => {
    fetchAttendCheckpointData({ id: params?.id });
  }, [fetch]);

  return (
    <>
      <ContentWrap
        subTitle={"Total Checkpoints "}
        listCount={
          loading || !attendanceCheckpoint
            ? "Loading..."
            : attendanceCheckpointCount
        }
        content={
          loading || !attendanceCheckpoint ? (
            <Loading />
          ) : attendanceCheckpointCount > 0 ? (
            <CheckpointsLists
              siteName={siteName}
              checkpointsData={attendanceCheckpoint}
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
            pageCount={1}
          />
        }
        totalCount={attendanceCheckpointCount}
        showingCount={attendanceCheckpointCount}
        loading={loading || !attendanceCheckpoint}
      />
    </>
  );
};

export default CheckpointsIndex;
