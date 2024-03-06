"use client";
import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import EditMasterSOPForm from "@/components/masterSOP/edit/form";
import CustomBreadcrumb from "@/components/manageLayout/breadcrumb";
import { extractPageName } from "@/utils/helpers";

const ViewMasterSOP = () => {
  const router = useRouter();
  const pathname = usePathname();
  const pageName =
    extractPageName(pathname, 1) + "/" + extractPageName(pathname, 2);
  const [masterSOPName, setMasterSOPName] = useState("");

  const handleBreadcrumbClick = (breadcrumbIndex) => {
    breadcrumbIndex === 0 && router.push(`/${pageName}`);
  };

  return (
    <>
      <CustomBreadcrumb
        title={"Master SOP"}
        breadcrumbList={[
          "Master SOP",
          `${masterSOPName ? masterSOPName : "---"}`,
        ]}
        handleBreadcrumbClick={handleBreadcrumbClick}
      />
      <EditMasterSOPForm setMasterSOPName={setMasterSOPName} view />
    </>
  );
};

export default ViewMasterSOP;
