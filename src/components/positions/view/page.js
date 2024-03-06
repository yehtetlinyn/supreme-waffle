"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ViewForm from "./form";
import CustomBreadcrumb from "@/components/manageLayout/breadcrumb";

const ViewPositionIndex = () => {
  const router = useRouter();
  const [positionName, setPositionName] = useState("");
  const breadcrumbList = ["Positions", positionName];

  const handleBreadcrumbClick = (index) => {
    if (index === 0) {
      router.push("/settings/positions");
    }
  };

  const handleCreate = () => {
    router.push("/settings/positions/create");
  };

  return (
    <>
      <CustomBreadcrumb
        title={positionName}
        breadcrumbList={breadcrumbList}
        handleBreadcrumbClick={handleBreadcrumbClick}
        createbtn={true}
        createBtnText="Create Position"
        handleCreate={handleCreate}
      />
      <ViewForm setPositionName={setPositionName} />
    </>
  );
};

export default ViewPositionIndex;
