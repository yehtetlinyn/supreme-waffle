"use client";
import React, { useState } from "react";

import CustomBreadcrumb from "@/components/manageLayout/breadcrumb";
import TabComponent from "@/components/siteManagement/manage/tabComponent";
import CreateSite from "@/components/siteManagement/create/site";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { extractPageName } from "@/utils/helpers";

const CreateSiteIndex = () => {
  const searchParams = useSearchParams();
  const activeTabName = searchParams.get("tab") || "site";
  const router = useRouter();
  const pathname = usePathname();
  const pageName =
    extractPageName(pathname, 1) + "/" + extractPageName(pathname, 2);

  //* route
  // http://localhost:3000/site/createSite (site tab)

  const [location, setLocation] = useState(null);
  const breadcrumbList = ["Site Settings", "Create New Site"];

  const handleBreadcrumbClick = (breadcrumbIndex) => {
    breadcrumbIndex === 0 && router.push(`/${pageName}`);
  };

  return (
    <>
      <CustomBreadcrumb
        title={"Site Settings"}
        breadcrumbList={breadcrumbList}
        handleBreadcrumbClick={handleBreadcrumbClick}
      />
      <TabComponent createSite />
      {activeTabName === "site" ? (
        <CreateSite location={location} setLocation={setLocation} />
      ) : activeTabName === "attendanceCheckpoint" ? (
        <CreateAttendanceCheckpoint
          location={location}
          setLocation={setLocation}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default CreateSiteIndex;
