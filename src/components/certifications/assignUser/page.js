"use client";
import React, { useEffect, useState } from "react";
import AssignUserForm from "./form";
import { useParams, useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";
import { CREATE_CERTIFICATE_PROFILE } from "@/graphql/mutations/certificateProfile";
import apolloClient from "@/lib/apolloClient";
import dayjs from "dayjs";
import CustomBreadcrumb from "@/components/manageLayout/breadcrumb";
import useCertificationsStore from "@/store/certifications";
import SuccessMessage from "@/components/modals/success";
import usePageStore from "@/store/pageStore";
import { shallow } from "zustand/shallow";
import LeaveConfirmPopup from "@/components/modals/leaveConfirmPopup";

const AssignUserIndex = () => {
  const router = useRouter();
  const params = useParams();
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [teamMembers, setTeamMembers] = useState(0);

  const [redirectLink, setRedirectLink] = useState("");
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

  const {
    getCertificates,
    certificateInfo,
    loading: certiInfoLoading,
  } = useCertificationsStore((state) => state);

  const title = certificateInfo[0]?.name;
  const breadcrumbList = ["Certifications", title, "Assign User"];
  const fetchCertificateData = async () => {
    await getCertificates({
      id: params.id,
    });
  };

  useEffect(() => {
    fetchCertificateData;
  }, []);

  const handleBreadcrumbClick = (index) => {
    if (index === 0) {
      isFormDirty
        ? (handleLeaveOpen(true), setRedirectLink("/settings/certifications"))
        : router.replace("/settings/certifications");
    } else if (index === 1) {
      isFormDirty
        ? (handleLeaveOpen(true),
          setRedirectLink(`/settings/certifications/view/${params.id}`))
        : router.replace(`/settings/certifications/view/${params.id}`);
    }
  };

  const [createCertificateProfileAction, { loading: createLoading }] =
    useMutation(CREATE_CERTIFICATE_PROFILE, {
      client: apolloClient,
      onCompleted: (data) => {},
      onError: (error) => console.log(error),
    });

  const formatCreateDate = (date) => {
    if (date) {
      return dayjs(date).format("YYYY-MM-DD");
    } else {
      return null;
    }
  };

  const submit = async (data) => {
    await createCertificateProfileAction({
      variables: {
        data: {
          certificate: +params.id,
          completionDate: formatCreateDate(data.completionDate),
          validityPeriod: data.validityPeriod,
          issueDate: formatCreateDate(data.issueDate),
          expirationDate: formatCreateDate(data.expiryDate),
          profiles: data.teamMembers.map((profile) => profile.id),
        },
      },
    });

    setTeamMembers(data.teamMembers?.length);
    setIsSuccessOpen(true);
  };

  const successToggle = () => {
    setIsSuccessOpen(!isSuccessOpen);
    router.replace(`/settings/certifications/view/${params.id}/assignuser`);
  };

  return (
    <>
      {isSuccessOpen && (
        <SuccessMessage
          isOpen={isSuccessOpen}
          toggle={successToggle}
          noOfAdded={teamMembers}
          positionName={title}
        />
      )}
      {isLeaveModal && (
        <LeaveConfirmPopup
          isOpen={isLeaveModal}
          toggle={() => handleLeaveOpen(false)}
          redirectLink={redirectLink}
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
      <AssignUserForm submit={submit} />
    </>
  );
};

export default AssignUserIndex;
