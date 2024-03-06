"use client";
import CustomBreadcrumb from "@/components/manageLayout/breadcrumb";
import useProjectStore from "@/store/project";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { useEffect } from "react";
import { shallow } from "zustand/shallow";
import ProjectTabs from "./projectTab";
import ProjectContent from "../edit/projectContent";
import DespatchContent from "../edit/despatchContent";
import ParticipantContent from "../edit/participantContent";
import CustomerContent from "../edit/customerContent";
import IssueTypesContent from "../edit/issueTypesContent";
import usePageStore from "@/store/pageStore";
import LeaveConfirmPopup from "@/components/modals/leaveConfirmPopup";

const ViewAndEditProject = () => {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabName = searchParams.get("tab");

  const { getProjectByID, projectTitle, loading, leaveRedirectLink } =
    useProjectStore(
      (state) => ({
        getProjectByID: state.getProjectByID,
        projectTitle: state.projectTitle,
        loading: state.loading,
        leaveRedirectLink: state.leaveRedirectLink,
      }),
      shallow
    );

  const { leaveModal, isFormDirty, handleLeaveOpen, sidebarLinkName } =
    usePageStore(
      (state) => ({
        leaveModal: state.leaveModal,
        isFormDirty: state.isFormDirty,
        handleLeaveOpen: state.handleLeaveOpen,
        sidebarLinkName: state.sidebarLinkName,
      }),
      shallow
    );

  useEffect(() => {
    getProjectByID({
      id: params?.id,
      deleted: false,
    });
  }, []);

  const handleBreadcrumbClick = () => {
    if (isFormDirty) {
      useProjectStore.setState({ leaveRedirectLink: "/settings/project" });
      usePageStore.setState({ leaveModal: true });
    } else {
      router.push("/settings/project");
    }
  };

  return (
    <>
      {leaveModal && (
        <LeaveConfirmPopup
          isOpen={leaveModal}
          toggle={() => handleLeaveOpen(false)}
          redirectLink={sidebarLinkName || leaveRedirectLink}
        />
      )}
      <CustomBreadcrumb
        title="Project"
        breadcrumbList={["Project", projectTitle]}
        handleBreadcrumbClick={handleBreadcrumbClick}
      />
      <ProjectTabs />
      {(tabName === "project" && <ProjectContent />) ||
        (tabName === "despatchTypes" && <DespatchContent />) ||
        (tabName === "issueTypes" && <IssueTypesContent />) ||
        (tabName === "participants" && <ParticipantContent />) ||
        (tabName === "customer" && <CustomerContent />)}
    </>
  );
};

export default ViewAndEditProject;
