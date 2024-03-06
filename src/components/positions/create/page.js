"use client";
import React, { useState } from "react";
import CreateForm from "./form";
import CustomBreadcrumb from "@/components/manageLayout/breadcrumb";
import { useRouter } from "next/navigation";

const CreatePositionIndex = () => {
  const router = useRouter();
  const breadcrumbList = ["Positions", "Create New Position"];

  const handleBreadcrumbClick = (index) => {
    router.push("/settings/positions");
  };

  return (
    <>
      <CustomBreadcrumb
        title="Positions"
        breadcrumbList={breadcrumbList}
        handleBreadcrumbClick={handleBreadcrumbClick}
      />
      <CreateForm action={"create"} />
    </>
  );
};

export default CreatePositionIndex;
