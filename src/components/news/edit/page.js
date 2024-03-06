"use client";
import CustomBreadcrumb from "@/components/manageLayout/breadcrumb";
import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { extractPageName } from "@/utils/helpers";
import EditForm from "./form";
import LeaveConfirmation from "@/components/modals/leave";
import LoadingDots from "@/components/base/loadingDots";
import useNewsStore from "@/store/newsStore";
import usePageStore from "@/store/pageStore";

const EditNewsIndex = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [newsTitle, setNewsTitle] = useState("");

  const actionMode = extractPageName(pathname, 3);
  const breadcrumbList = newsTitle
    ? ["News", newsTitle]
    : ["News", <LoadingDots />];

  const newsId = useNewsStore((state) => state.newsId);
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
      router.push("/agency/news");
    } else if (breadcrumbNum === 1 && actionMode === "edit") {
      handleLeaveOpen(true);
    }
  };

  return (
    <>
      <CustomBreadcrumb
        title={"News"}
        breadcrumbList={breadcrumbList}
        handleBreadcrumbClick={handleBreadcrumbClick}
      />
      <EditForm setNewsTitle={setNewsTitle} />
      <LeaveConfirmation isOpen={leaveModal} toggle={handleToggle} />
    </>
  );
};

export default EditNewsIndex;
