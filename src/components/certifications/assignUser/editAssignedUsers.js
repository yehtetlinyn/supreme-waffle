"use client";
import React, { useEffect, useState } from "react";
import AssignUserForm from "./form";
import useProfileStore from "@/store/profile";
import { redirect, useParams, useRouter } from "next/navigation";
import Loading from "@/components/modals/loading";
import { UPDATE_CERTIFICATE_PROFILE } from "@/graphql/mutations/certificateProfile";
import { useMutation } from "@apollo/client";
import apolloClient from "@/lib/apolloClient";
import dayjs from "dayjs";
import useCertificateProfileStore from "@/store/certificateProfile";
import CustomBreadcrumb from "@/components/manageLayout/breadcrumb";
import usePageStore from "@/store/pageStore";
import { shallow } from "zustand/shallow";
import LeaveConfirmPopup from "@/components/modals/leaveConfirmPopup";

const EditAssignedUsers = () => {
  const router = useRouter();
  const params = useParams();

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
    getCertificateProfiles,
    CertificateProfileInfo,
    loading: certiProfileLoading,
  } = useCertificateProfileStore((state) => state);

  const title = CertificateProfileInfo[0]?.certificate.name;
  const breadcrumbList = ["Certifications", title, "Assign User"];

  const fetchCertificateProfileData = async () => {
    await getCertificateProfiles({
      where: {
        certificateProfileId: +params.assignuserid,
      },
    });
  };

  useEffect(() => {
    fetchCertificateProfileData();
  }, []);

  const [updateCertificateProfileAction, { loading: updateLoading }] =
    useMutation(UPDATE_CERTIFICATE_PROFILE, {
      client: apolloClient,
      onCompleted: (data) => {
        router.back();
      },
      onError: (error) => console.log(error),
    });

  const formatCreateDate = (date) => {
    if (date) {
      return dayjs(date).format("YYYY-MM-DD");
    } else {
      return null;
    }
  };

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

  const submit = async (data) => {
    console.log(data);
    await updateCertificateProfileAction({
      variables: {
        id: +params.assignuserid,
        data: {
          completionDate: formatCreateDate(data.completionDate),
          validityPeriod: data.validityPeriod,
          issueDate: formatCreateDate(data.issueDate),
          expirationDate: formatCreateDate(data.expiryDate),
          profiles: data.teamMembers.map((profile) => profile.id),
        },
      },
    });
  };

  if (certiProfileLoading) {
    return <Loading />;
  } else {
    return (
      <>
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
        <AssignUserForm
          submit={submit}
          certificateProfiles={CertificateProfileInfo[0]}
          setRedirectLink={setRedirectLink}
        />
      </>
    );
  }
};

export default EditAssignedUsers;
