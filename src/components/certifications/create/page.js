"use client";
import React, { useState } from "react";
import CertActionForm from "../actions/form";
import { useMutation } from "@apollo/client";
import apolloClient from "@/lib/apolloClient";
import { useRouter } from "next/navigation";
import { CREATE_CERTIFICATE } from "@/graphql/mutations/certificate";
import CustomBreadcrumb from "@/components/manageLayout/breadcrumb";
import usePageStore from "@/store/pageStore";
import { shallow } from "zustand/shallow";

const CreateCert = () => {
  const router = useRouter();
  const breadcrumbList = ["Certifications", "Create New Certification"];

  const [createCertificate, { loading }] = useMutation(CREATE_CERTIFICATE, {
    client: apolloClient,
    onCompleted: (data) => {
      router.push(
        `/settings/certifications/view/${data?.createCertificate.data?.id}/assignuser/create`
      );
    },
    onError: (error) => {
      console.log("error", error);
    },
  });

  const handleBreadcrumbClick = () => {
    router.replace("/settings/certifications");
  };

  const submit = async (data) => {
    await createCertificate({
      variables: {
        data: {
          name: data.certiName,
          description: data.description,
          duration: data.duration,
          verification: data.certiVerification,
          trainingLocation: data.trainingLocation,
          providerName: data.providerName,
          logo: data.icon.id,
        },
      },
    });
  };

  return (
    <>
      <CustomBreadcrumb
        title="Certifications"
        breadcrumbList={breadcrumbList}
        handleBreadcrumbClick={handleBreadcrumbClick}
      />
      <CertActionForm submit={submit} />
    </>
  );
};

export default CreateCert;
