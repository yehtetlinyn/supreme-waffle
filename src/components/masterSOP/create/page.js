"use client";
import React from "react";
import CreateMasterSOPForm from "./form";
import CustomBreadcrumb from "@/components/manageLayout/breadcrumb";
import { usePathname, useRouter } from "next/navigation";
import { extractPageName } from "@/utils/helpers";

const CreateMasterSOP = () => {
  const router = useRouter();
  const pathname = usePathname();
  const pageName =
    extractPageName(pathname, 1) + "/" + extractPageName(pathname, 2);
  const breadcrumbList = ["Master SOP", "Create SOP"];

  const handleBreadcrumbClick = (breadcrumbIndex) => {
    breadcrumbIndex === 0 && router.replace(`/${pageName}`);
  };
  return (
    <>
      <CustomBreadcrumb
        title={"Master SOP"}
        breadcrumbList={breadcrumbList}
        handleBreadcrumbClick={handleBreadcrumbClick}
      />
      <CreateMasterSOPForm />
    </>
  );
};

export default CreateMasterSOP;
