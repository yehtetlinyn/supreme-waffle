"use client";
import CustomBreadcrumb from "@/components/manageLayout/breadcrumb";
import { useRouter } from "next/navigation";
import React from "react";
import CreateForm from "./form";

const CreateNewsIndex = () => {
  const router = useRouter();
  const breadcrumbList = ["News", "Create News"];

  const handleBreadcrumbClick = (breadcrumbNum) => {
    breadcrumbNum === 0 && router.push("/agency/news");
  };

  return (
    <>
      <CustomBreadcrumb
        title={"News"}
        breadcrumbList={breadcrumbList}
        handleBreadcrumbClick={handleBreadcrumbClick}
      />
      <CreateForm action={"create"} />
    </>
  );
};

export default CreateNewsIndex;
