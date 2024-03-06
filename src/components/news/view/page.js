"use client";
import CustomBreadcrumb from "@/components/manageLayout/breadcrumb";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import ViewForm from "./form";
import LoadingDots from "@/components/base/loadingDots";

const ViewNewsIndex = () => {
  const router = useRouter();
  const [newsTitle, setNewsTitle] = useState("");
  const breadcrumbList = newsTitle
    ? ["News", newsTitle]
    : ["News", <LoadingDots />];

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
      <ViewForm setNewsTitle={setNewsTitle} />
    </>
  );
};

export default ViewNewsIndex;
