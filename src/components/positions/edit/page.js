"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import EditForm from "./form";
import CustomBreadcrumb from "@/components/manageLayout/breadcrumb";
import usePositionStore from "@/store/position";
import Loading from "@/components/modals/loading";
import usePageStore from "@/store/pageStore";
import LeaveConfirmation from "@/components/modals/leave";
import { shallow } from "zustand/shallow";

const EditPositionIndex = () => {
  const router = useRouter();

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
    getPositions,
    positionInfo,
    loading: positionInfoLoading,
  } = usePositionStore(
    (state) => ({
      getPositions: state.getPositions,
      positionInfo: state.positionInfo,
      loading: state.loading,
    }),
    shallow
  );

  const [positionTitle, setPositionTitle] = useState("");
  const breadcrumbList = ["Positions", positionTitle];
  // const [isFormDirty, setIsFormDirty] = useState(false);

  const fetchPositionsData = async () => {
    await getPositions({
      where: {
        deleted: false,
        limit: -1,
      },
    });
  };

  useEffect(() => {
    fetchPositionsData();
  }, []);

  const handleBreadcrumbClick = (index) => {
    if (isFormDirty) {
      handleLeaveOpen(true);
    } else {
      router.replace("/settings/positions");
    }
  };

  const handleCreate = () => {
    router.push("/settings/positions/create");
  };

  const handleToggle = () => {
    if (isLeaveModal) {
      handleLeaveOpen(!isLeaveModal);
    }
  };

  return (
    <>
      {isLeaveModal && (
        <LeaveConfirmation isOpen={isLeaveModal} toggle={handleToggle} />
      )}
      <CustomBreadcrumb
        title={positionTitle}
        breadcrumbList={breadcrumbList}
        handleBreadcrumbClick={handleBreadcrumbClick}
        createbtn={true}
        createBtnText="Create Position"
        handleCreate={handleCreate}
      />
      {positionInfoLoading ? (
        <div>
          <Loading />
        </div>
      ) : (
        <EditForm
          allPositions={positionInfo}
          // setIsFormDirty={setIsFormDirty}
          setPositionTitle={setPositionTitle}
        />
      )}
    </>
  );
};

export default EditPositionIndex;
