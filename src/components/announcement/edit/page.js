"use client";
import CustomBreadcrumb from "@/components/manageLayout/breadcrumb";
import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import EditForm from "./form";
import LeaveConfirmation from "@/components/modals/leave";
import LoadingDots from "@/components/base/loadingDots";
import useAnnouncementStore from "@/store/announceStore";
import { extractPageName } from "@/utils/helpers";
import usePageStore from "@/store/pageStore";

const EditAnnouncementIndex = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [announcementTitle, setAnnouncementTitle] = useState("");

  const actionMode = extractPageName(pathname, 3);
  const breadcrumbList = announcementTitle
    ? ["Announcement", announcementTitle]
    : ["Announcement", <LoadingDots />];

  const announceId = useAnnouncementStore((state) => state.announceId);
  const { leaveModal, handleLeaveOpen } = usePageStore((state) => ({
    leaveModal: state.leaveModal,
    handleLeaveOpen: state.handleLeaveOpen,
  }));

  const handleToggle = () => {
    if (leaveModal) {
      handleLeaveOpen(!leaveModal);
    }
  };

  const handleBreadcrumbClick = (breadcrumbNum) => {
    if (breadcrumbNum === 0) {
      router.push("/agency/announcement");
    } else if (breadcrumbNum === 1 && actionMode === "edit") {
      handleLeaveOpen(true);
    }
  };

  return (
    <>
      <CustomBreadcrumb
        title={"Announcement"}
        breadcrumbList={breadcrumbList}
        handleBreadcrumbClick={handleBreadcrumbClick}
      />
      <EditForm setAnnouncementTitle={setAnnouncementTitle} />
      <LeaveConfirmation isOpen={leaveModal} toggle={handleToggle} />
    </>
  );
};

export default EditAnnouncementIndex;
