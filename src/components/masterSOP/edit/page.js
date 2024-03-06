"use client";
import React, { useState } from "react";

import { usePathname, useRouter } from "next/navigation";
import { shallow } from "zustand/shallow";
import usePageStore from "@/store/pageStore";

import LeaveConfirmation from "@/components/modals/leave";
import EditMasterSOPForm from "@/components/masterSOP/edit/form";
import CustomBreadcrumb from "@/components/manageLayout/breadcrumb";
import { extractPageName } from "@/utils/helpers";
import useSiteStore from "@/store/siteStore";

const EditMasterSOP = () => {
  const router = useRouter();
  const pathname = usePathname();
  const pageName =
    extractPageName(pathname, 1) + "/" + extractPageName(pathname, 2);
  const [masterSOPName, setMasterSOPName] = useState("");

  const { leaveModal: isLeaveModal, handleLeaveOpen } = usePageStore(
    (state) => ({
      leaveModal: state.leaveModal,
      handleLeaveOpen: state.handleLeaveOpen,
    }),
    shallow
  );

  const isFormDirty = usePageStore((state) => state.isFormDirty);

  const handleToggle = () => {
    if (isLeaveModal) {
      handleLeaveOpen(!isLeaveModal);
    }
  };

  const handleBreadcrumbClick = (breadcrumbIndex) => {
    if (breadcrumbIndex === 0 && isFormDirty) {
      handleLeaveOpen(true);
    } else {
      router.replace(`/${pageName}`);
    }
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
      <EditMasterSOPForm setMasterSOPName={setMasterSOPName} />
      <LeaveConfirmation isOpen={isLeaveModal} toggle={handleToggle} />
    </>
  );
};
export default EditMasterSOP;
