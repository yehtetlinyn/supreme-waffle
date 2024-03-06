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
import EditSiteSOP from "@/components/siteManagement/edit/sop";
import EditSiteUsers from "@/components/siteManagement/edit/siteUsers/page";

import useSiteStore from "@/store/siteStore";
import useSiteSopStore from "@/store/siteSopStore";
import useSiteUserStore from "@/store/siteUserStore";
import CustomBreadcrumb from "@/components/manageLayout/breadcrumb";
import { extractPageName } from "@/utils/helpers";
import usePageStore from "@/store/pageStore";

const pageSize = 10;
const ViewSiteIndex = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const pageName =
    extractPageName(pathname, 1) + "/" + extractPageName(pathname, 2);
  const activeTabName = searchParams.get("tab") || "site";

  const title = searchParams.get("sopName");
  const replacedTitle = title ? title.replace(/\+/g, " ") : "";
  const incidentId = searchParams.get("incidentType");
  const priority = searchParams.get("priority");
  const username = searchParams.get("username");

  const [siteSopCurrentPage, setSiteSopCurrentPage] = useState(1);
  const [siteUserCurrentPage, setSiteUserCurrentPage] = useState(1);
  const [isSiteSop, setIsSiteSop] = useState(true);
  const { id } = useParams();

  //* route
  // http://localhost:3000/site/view/1 (site tab)
  // http://localhost:3000/site/view/1&tab=attendanceCheckpoint (attendance checkpoint tab)
  // http://localhost:3000/site/view/1&tab=shiftSetting (shift roaster tab)

  const {
    loading,
    fetchAttendCheckpointData,
    fetchShiftSettingBySiteId,
    shiftSettingsCount,
    attendanceCheckpointCount,
    attendanceCheckpoint,
    siteName,
    fetchSiteName,
  } = useSiteStore(
    (state) => ({
      loading: state.loading,
      fetchAttendCheckpointData: state.fetchAttendCheckpointData,
      fetchShiftSettingBySiteId: state.fetchShiftSettingBySiteId,
      shiftSettingsCount: state.shiftSettingsCount,
      attendanceCheckpointCount: state.attendanceCheckpointCount,
      attendanceCheckpoint: state.attendanceCheckpoint,
      siteName: state.siteName,
      fetchSiteName: state.fetchSiteName,
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
    })
  );

  const { handleLeaveOpen, setSiteTabName, isFormDirty } = usePageStore(
    (state) => ({
      leaveModal: state.leaveModal,
      handleLeaveOpen: state.handleLeaveOpen,
      setSiteTabName: state.setSiteTabName,
      isFormDirty: state.isFormDirty,
    }),
    shallow
  );

  const handleBreadcrumbClick = (breadcrumbIndex) => {
    if (breadcrumbIndex === 0) {
      if (activeTabName === "sop" && isFormDirty) {
        handleLeaveOpen(true);
        setSiteTabName("");
        setIsSiteSop(false);
      } else {
        router.replace(`/${pageName}`);
      }
    }
  };

  useEffect(() => {
    fetchAttendCheckpointData({ id });
    fetchShiftSettingBySiteId({ id });
    fetchSiteName(id);
  }, []);

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

  return (
    <>
      <CustomBreadcrumb
        title={"Site Settings"}
        breadcrumbList={["Site Settings", `${loading ? "---" : siteName}`]}
        handleBreadcrumbClick={handleBreadcrumbClick}
      />
      <TabComponent
        view
        checkpointCount={attendanceCheckpointCount}
        loading={loading}
        shiftSettingsCount={shiftSettingsCount}
      />
      {activeTabName === "site" ? (
        //use edit component as a view because these twos are almost same
        <EditSite view />
      ) : activeTabName === "attendanceCheckpoint" ? (
        <EditAttendanceCheckpoint
          view
          loading={loading}
          attendanceCheckpoint={attendanceCheckpoint}
        />
      ) : activeTabName === "shiftSetting" ? (
        <EditShiftSetting view />
      ) : activeTabName === "sop" ? (
        <EditSiteSOP
          view
          currentPage={siteSopCurrentPage}
          setCurrentPage={setSiteSopCurrentPage}
          isSiteSop={isSiteSop}
        />
      ) : (
        <EditSiteUsers
          view
          currentPage={siteUserCurrentPage}
          setCurrentPage={setSiteUserCurrentPage}
        />
      )}
    </>
  );
};

export default ViewSiteIndex;
