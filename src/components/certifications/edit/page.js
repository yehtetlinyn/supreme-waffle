import React, { useState } from "react";
import CertActionForm from "../actions/form";
import { useMutation } from "@apollo/client";
import { UPDATE_CERTIFICATE } from "@/graphql/mutations/certificate";
import apolloClient from "@/lib/apolloClient";
import { useParams, useRouter } from "next/navigation";
import CustomBreadcrumb from "@/components/manageLayout/breadcrumb";
import usePageStore from "@/store/pageStore";
import { shallow } from "zustand/shallow";
import LeaveConfirmation from "@/components/modals/leave";

const EditCert = ({ fetchedData }) => {
  const params = useParams();
  const router = useRouter();
  const title = fetchedData?.name;
  const breadcrumbList = ["Certifications", title];

  const {
    leaveModal: isLeaveModal,
    handleLeaveOpen,
    isFormDirty,
  } = usePageStore(
    (state) => ({
      leaveModal: state.leaveModal,
      handleLeaveOpen: state.handleLeaveOpen,
      isFormDirty: state.isFormDirty,
    }),
    shallow
  );

  const [updateCertiAction, { loading: updateCertiLoading }] = useMutation(
    UPDATE_CERTIFICATE,
    {
      client: apolloClient,
      onCompleted: (data) => router.back(),
      onError: (error) => console.log(error),
    }
  );

  const handleBreadcrumbClick = () => {
    isFormDirty
      ? handleLeaveOpen(true)
      : router.replace("/settings/certifications");
  };

  const submit = async (data) => {
    await updateCertiAction({
      variables: {
        id: +params.id,
        data: {
          name: data.certiName,
          providerName: data.providerName,
          trainingLocation: data.trainingLocation,
          duration: data.duration,
          description: data.description,
          verification: data.certiVerification,
          logo: data.icon.id,
        },
      },
    });
  };

  console.log("isleavemodal", isLeaveModal);

  return (
    <>
      {isLeaveModal && (
        <LeaveConfirmation
          isOpen={isLeaveModal}
          toggle={() => handleLeaveOpen(false)}
        />
      )}
      <CustomBreadcrumb
        title={title}
        breadcrumbList={breadcrumbList}
        handleBreadcrumbClick={handleBreadcrumbClick}
        createbtn={true}
        createBtnText="Create Certification"
        handleCreate={() => router.replace("/settings/certifications/create")}
      />
      <CertActionForm fetchedData={fetchedData} submit={submit} />
    </>
  );
};

export default EditCert;
