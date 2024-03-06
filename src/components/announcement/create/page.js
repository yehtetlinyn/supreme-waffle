"use client";
import CustomBreadcrumb from "@/components/manageLayout/breadcrumb";
import { useRouter } from "next/navigation";
import React from "react";
import CreateForm from "./form";

const CreateAnnouncementIndex = () => {
  const router = useRouter();
  const breadcrumbList = ["Announcement", "Create Announcement"];

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
      <CreateForm action={"create"} />
    </>
  );
};

export default CreateAnnouncementIndex;
