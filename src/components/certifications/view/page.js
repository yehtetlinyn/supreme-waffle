"use client";
import React from "react";
import CertActionForm from "../actions/form";
import CustomBreadcrumb from "@/components/manageLayout/breadcrumb";
import { useRouter } from "next/navigation";

const ViewCerti = ({ fetchedData }) => {
  const router = useRouter();
  const title = fetchedData?.name;
  const breadcrumbList = ["Certifications", title];
  return (
    <>
      <CustomBreadcrumb
        title={title}
        breadcrumbList={breadcrumbList}
        handleBreadcrumbClick={() => router.replace("/settings/certifications")}
        createbtn={true}
        createBtnText="Create Certification"
        handleCreate={() => router.replace("/settings/certifications/create")}
      />
      <CertActionForm fetchedData={fetchedData} />
    </>
  );
};

export default ViewCerti;
