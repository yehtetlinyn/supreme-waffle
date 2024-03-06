"use client";
import React, { useEffect, useState } from "react";

import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { shallow } from "zustand/shallow";

import TabComponent from "@/components/siteManagement/manage/tabComponent";
import EditSite from "@/components/siteManagement/edit/site";
import EditAttendanceCheckpoint from "@/components/siteManagement/edit/attendanceCheckpoint";
import EditShiftSetting from "@/components/siteManagement/edit/shiftSetting";

import useSiteStore from "@/store/siteStore";
import EditSiteSOP from "@/components/siteManagement/edit/sop";
import useMasterSOPStore from "@/store/masterSOPStore";
import useSiteSopStore from "@/store/siteSopStore";
import EditSiteUsers from "@/components/siteManagement/edit/siteUsers/page";
import useSiteUserStore from "@/store/siteUserStore";
import CustomBreadcrumb from "@/components/manageLayout/breadcrumb";
import usePageStore from "@/store/pageStore";
import LeaveConfirmation from "@/components/modals/leave";
import { extractPageName } from "@/utils/helpers";

const pageSize = 10;
const EditSiteIndex = () => {
  //* route
  // http://localhost:3000/site/edit/1 (site tab)
  // http://localhost:3000/site/edit/1&tab=attendanceCheckpoint (attendance checkpoint tab)
  // http://localhost:3000/site/edit/1&tab=shiftSetting (shift roaster tab)

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const id = params.id;
  const activeTabName = searchParams.get("tab") || "site";

  const title = searchParams.get("sopName");
  const replacedTitle = title ? title.replace(/\+/g, " ") : "";
  const incidentId = searchParams.get("incidentType");
  const priority = searchParams.get("priority");
  const username = searchParams.get("username");
  const pageName =
    extractPageName(pathname, 1) + "/" + extractPageName(pathname, 2);

  const [siteSopCurrentPage, setSiteSopCurrentPage] = useState(1);
  const [siteUserCurrentPage, setSiteUserCurrentPage] = useState(1);
  const [isSiteSop, setIsSiteSop] = useState(false);
  const [location, setLocation] = useState(null);

  const {
    leaveModal: isLeaveModal,
    handleLeaveOpen,
    setSiteTabName,
    isFormDirty,
  } = usePageStore(
    (state) => ({
      leaveModal: state.leaveModal,
      handleLeaveOpen: state.handleLeaveOpen,
      setSiteTabName: state.setSiteTabName,
      isFormDirty: state.isFormDirty,
    }),
    shallow
  );

  const {
    loading,
    fetchAttendCheckpointData,
    fetchShiftSettingBySiteId,
    shiftSettingsCount,
    fetch,
    attendanceCheckpointCount,
    attendanceCheckpoint,
    fetchSiteName,
    siteName,
  } = useSiteStore(
    (state) => ({
      loading: state.loading,
      fetchAttendCheckpointData: state.fetchAttendCheckpointData,
      fetchShiftSettingBySiteId: state.fetchShiftSettingBySiteId,
      shiftSettingsCount: state.shiftSettingsCount,
      fetch: state.fetch,
      attendanceCheckpoint: state.attendanceCheckpoint,
      attendanceCheckpointCount: state.attendanceCheckpointCount,
      fetchSiteName: state.fetchSiteName,
      siteName: state.siteName,
    }),
    shallow
  );

  const { fetchSiteSops, fetch: siteSopFetch } = useSiteSopStore(
    (state) => ({
      fetchSiteSops: state.fetchSiteSops,
      fetch: state.fetch,
    }),
    shallow
  );

  const { fetchSiteUsers, fetch: siteUserFetch } = useSiteUserStore(
    (state) => ({
      fetchSiteUsers: state.fetchSiteUsers,
      fetch: state.fetch,
    }),
    shallow
  );

  const handleBreadcrumbClick = (breadcrumbIndex) => {
    if (
      breadcrumbIndex === 0 &&
      (activeTabName === "site" ||
        activeTabName === "attendanceCheckpoint" ||
        activeTabName === "shiftSetting" ||
        activeTabName === "sop") &&
      isFormDirty
    ) {
      handleLeaveOpen(true);
      setIsSiteSop(false);
      setSiteTabName("");
    } else {
      router.push(`/${pageName}`);
    }
  };

  const handleToggle = () => {
    if (isLeaveModal) {
      handleLeaveOpen(!isLeaveModal);
    }
  };

  useEffect(() => {
    fetchAttendCheckpointData({ id });
    fetchShiftSettingBySiteId({ id });
  }, [fetch]);

  useEffect(() => {
    fetchSiteSops({
      replacedTitle,
      incidentId,
      priority,
      siteSopCurrentPage,
      pageSize,
      id,
    });
  }, [replacedTitle, incidentId, priority, siteSopCurrentPage, siteSopFetch]);

  useEffect(() => {
    fetchSiteUsers({
      siteId: id,
      username,
      siteUserCurrentPage,
      pageSize,
    });
  }, [siteUserFetch, siteUserCurrentPage, username]);

  useEffect(() => {
    fetchSiteName(id);
  }, []);

  return (
    <>
      {isLeaveModal && (
        <LeaveConfirmation
          isOpen={isLeaveModal}
          toggle={handleToggle}
          setIsView={() => {}}
        />
      )}
      <CustomBreadcrumb
        title={"Site Settings"}
        breadcrumbList={["Site Settings", `${siteName}`]}
        handleBreadcrumbClick={handleBreadcrumbClick}
      />
      <TabComponent
        edit
        checkpointCount={attendanceCheckpointCount}
        loading={loading}
        shiftSettingsCount={shiftSettingsCount}
      />
      {activeTabName === "site" ? (
        <EditSite location={location} setLocation={setLocation} />
      ) : activeTabName === "attendanceCheckpoint" ? (
        <EditAttendanceCheckpoint
          location={location}
          setLocation={setLocation}
          attendanceCheckpoint={attendanceCheckpoint}
          loading={loading}
        />
      ) : activeTabName === "shiftSetting" ? (
        <EditShiftSetting />
      ) : activeTabName === "sop" ? (
        <EditSiteSOP
          setCurrentPage={setSiteSopCurrentPage}
          currentPage={siteSopCurrentPage}
          isSiteSop={isSiteSop}
        />
      ) : (
        <EditSiteUsers
          setCurrentPage={setSiteUserCurrentPage}
          currentPage={siteUserCurrentPage}
        />
      )}
    </>
  );
};

export default EditSiteIndex;
