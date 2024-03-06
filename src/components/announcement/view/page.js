"use client";
import CustomBreadcrumb from "@/components/manageLayout/breadcrumb";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import ViewForm from "./form";
import LoadingDots from "@/components/base/loadingDots";

const ViewAnnouncementIndex = () => {
  const router = useRouter();
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const breadcrumbList = announcementTitle
    ? ["Announcement", announcementTitle]
    : ["Announcement", <LoadingDots />];

  const handleBreadcrumbClick = (breadcrumbNum) => {
    breadcrumbNum === 0 && router.push("/agency/announcement");
  };

  return (
    <>
      <CustomBreadcrumb
        title={"Announcement"}
        breadcrumbList={breadcrumbList}
        handleBreadcrumbClick={handleBreadcrumbClick}
      />
      <ViewForm setAnnouncementTitle={setAnnouncementTitle} />
    </>
  );
};

export default ViewAnnouncementIndex;
