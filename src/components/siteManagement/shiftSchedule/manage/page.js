"use client";
import CustomBreadcrumb from "@/components/manageLayout/breadcrumb";
import LoadingDots from "@/components/base/loadingDots";
import manageStyle from "../style.module.css";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import TabChangers from "./tabChanger";
import CheckpointsIndex from "../checkpoints/page";
import AttendanceHistoryIndex from "../attendanceHistory/page";
import ShiftScheduleHeader from "./header";
import WeekShiftScheduleIndex from "../week/page";
import MonthShiftScheduleIndex from "../month/page";
import usePageStore from "@/store/pageStore";
import useSiteStore from "@/store/siteStore";
import { getInitialStartingDay } from "@/utils/data";

const ShiftRosterScheduleIndex = () => {
  const router = useRouter();
  const params = useParams();
  const initialStartingDay = getInitialStartingDay();

  const [startingDay, setStartingDay] = useState(initialStartingDay);

  const { activeButton, shiftRosterTab, setCurrentTab, resetPageStates } =
    usePageStore((state) => ({
      activeButton: state.activeButton,
      shiftRosterTab: state.shiftRosterTab,
      setCurrentTab: state.setCurrentTab,
      resetPageStates: state.resetPageStates,
    }));
  const { siteName, fetchSiteName } = useSiteStore((state) => ({
    siteName: state.siteName,
    fetchSiteName: state.fetchSiteName,
  }));

  const breadcrumbList = siteName
    ? ["Site Operations", siteName]
    : ["Site Operations", <LoadingDots />];

  const handleBreadcrumbClick = (breadcrumbNum) => {
    breadcrumbNum === 0 && router.push("/siteOperations/site");
  };

  useEffect(() => {
    fetchSiteName(params?.id);
  }, []);

  useEffect(() => {
    resetPageStates();
  }, []);

  return (
    <section>
      <CustomBreadcrumb
        title={siteName}
        breadcrumbList={breadcrumbList}
        handleBreadcrumbClick={handleBreadcrumbClick}
      />

      <div
        className={`${
          shiftRosterTab === "rosterAssignment" && manageStyle.containerWrapper
        }`}
      >
        <TabChangers
          currentTab={shiftRosterTab}
          setCurrentTab={setCurrentTab}
        />
        {shiftRosterTab === "rosterAssignment" && (
          <div className={manageStyle.sectionContainer}>
            <ShiftScheduleHeader
              setStartingDay={setStartingDay}
              startingDay={startingDay}
            />
            {activeButton === 1 && (
              <WeekShiftScheduleIndex
                startingDay={startingDay}
                setStartingDay={setStartingDay}
              />
            )}
            {activeButton === 2 && <MonthShiftScheduleIndex />}
          </div>
        )}
        {shiftRosterTab === "checkpoints" && <CheckpointsIndex />}
        {shiftRosterTab === "attendanceHistory" && <AttendanceHistoryIndex />}
      </div>
    </section>
  );
};

export default ShiftRosterScheduleIndex;
