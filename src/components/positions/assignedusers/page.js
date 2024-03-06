"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { useMutation } from "@apollo/client";

import styles from "./assignedUsers.module.css";
import commonStyles from "../../styles/commonStyles.module.css";

import AssignedUsersHeader from "./header";
import AssignedUsersTable from "./assignedUsersTable";
import AddUsers from "./addUsers";
import DeleteConfirmation from "@/components/modals/delete";
import Loading from "@/components/modals/loading";
import SuccessMessage from "@/components/modals/success";
import NoData from "@/components/noData/noData";
import CustomBreadcrumb from "@/components/manageLayout/breadcrumb";
import Paginate from "@/components/pagination/page";

import apolloClient from "@/lib/apolloClient";
import { GET_PROFILES } from "@/graphql/queries/profile";
import { GET_POSITIONS } from "@/graphql/queries/positions";
import { UPDATE_PROFILE } from "@/graphql/mutations/profile";
import useProfileStore from "@/store/profile";
import { UPDATE_POSITIONS } from "@/graphql/mutations/positions";

const AssignedUsersIndex = () => {
  const router = useRouter();
  const params = useParams();

  const [existedUsers, setExistedUsers] = useState([]);
  const [otherUsers, setOtherUsers] = useState([]);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  const [positionTitle, setPositionTitle] = useState("");
  const breadcrumbList = ["Positions", positionTitle, "Assigned Users"];
  const [currentPage, setCurrentPage] = useState(1);

  const [isDelete, setIsDelete] = useState(false);
  const [userToDelete, setUserToDelete] = useState([]);

  const [successModal, setSuccessModal] = useState(false);
  const [newAddedUsers, setNewAddedUsers] = useState(0);

  const {
    getProfiles,
    profileInfo,
    loading: profileLoading,
    total: profileTotal,
    pageCount: profilePageCount,
  } = useProfileStore((state) => ({
    getProfiles: state.getProfiles,
    profileInfo: state.profileInfo,
    loading: state.loading,
    total: state.total,
    pageCount: state.pageCount,
  }));

  const fetchUsersData = async () => {
    await getProfiles({
      where: {
        positionId: params?.id,
        pageNum: currentPage,
        pageSize: 10,
      },
    });

    const { data: allUser } = await apolloClient.query({
      fetchPolicy: "network-only",
      query: GET_PROFILES,
      variables: {
        limit: -1,
      },
    });

    const { data: positionsData } = await apolloClient.query({
      fetchPolicy: "network-only",
      query: GET_POSITIONS,
      variables: {
        id: params?.id,
      },
    });

    if (allUser) {
      setExistedUsers(
        allUser?.profiles.data?.filter(
          (user) => user.attributes.position.data?.id == params.id
        )
      );
      setOtherUsers(
        allUser?.profiles.data?.filter(
          (user) => +user.attributes.position.data?.id !== +params.id
        )
      );
    }

    if (positionsData) {
      setPositionTitle(positionsData?.positions.data[0]?.attributes.name);
    }
  };

  useEffect(() => {
    fetchUsersData();
  }, [currentPage]);

  useMemo(() => {
    if (currentPage > profilePageCount) setCurrentPage(profilePageCount);
  }, [profilePageCount]);

  const [updatePosition] = useMutation(UPDATE_POSITIONS, {
    client: apolloClient,
    onError: (error) => console.log(error),
  });

  const addUserToggle = () => {
    setIsAddUserOpen(!isAddUserOpen);
  };

  const deleteToggle = () => {
    setIsDelete(!isDelete);
  };

  const successToggle = () => {
    setSuccessModal(!successModal);
  };

  const addUserHandler = async (selectedUsers) => {
    setNewAddedUsers(+selectedUsers.length);

    //Combine existed and new selected users to get updated users list
    const updatedProfileIds = existedUsers
      ?.map((profile) => profile.id)
      .concat(selectedUsers?.map((profile) => profile.id));

    await updatePosition({
      variables: {
        id: params.id,
        data: {
          profiles: updatedProfileIds,
        },
      },
    });
    setSuccessModal(true);
    fetchUsersData();
  };

  const deleteHandler = async () => {
    const existedProfileIds = existedUsers.map((profile) => profile.id);
    const profileIdsToDelete = userToDelete?.map((profile) => profile.id);
    //Remove selected profiles to delete from existed profiles to get updated profile list
    const updatedProfileIds = existedProfileIds?.filter(
      (id) => !profileIdsToDelete?.includes(id)
    );

    await updatePosition({
      variables: {
        id: params.id,
        data: {
          profiles: updatedProfileIds,
        },
      },
    });
    fetchUsersData();
    deleteToggle();
  };

  const handleBreadcrumbClick = (index) => {
    if (index === 0) {
      router.push("/settings/positions");
    } else if (index === 1) {
      router.push(`/settings/positions/view/${params.id}`);
    }
  };

  const handleCreate = () => {
    router.push("/settings/positions/create");
  };

  return (
    <>
      <CustomBreadcrumb
        title="Positions"
        breadcrumbList={breadcrumbList}
        handleBreadcrumbClick={handleBreadcrumbClick}
        createbtn={true}
        createBtnText="Create Position"
        handleCreate={handleCreate}
      />
      <div className={styles.contentWrapper}>
        <AssignedUsersHeader
          addBtnHandler={addUserToggle}
          total={profileLoading ? "Loading..." : profileTotal}
          deleteBtnDisable={userToDelete.length === 0}
          deleteConfirmationModalHandler={deleteToggle}
        />
        <AddUsers
          otherUsers={otherUsers}
          addUserHandler={addUserHandler}
          isOpen={isAddUserOpen}
          toggle={addUserToggle}
        />
        {profileLoading ? (
          <Loading />
        ) : profileInfo?.length > 0 ? (
          <AssignedUsersTable
            userList={profileInfo}
            deleteToggle={deleteToggle}
            setUserToDelete={setUserToDelete}
            userToDelete={userToDelete}
          />
        ) : (
          <div>
            <NoData />
          </div>
        )}
        <div style={{ marginTop: "auto" }}>
          <small className={commonStyles.entriesText}>
            {`Showing ${profileInfo?.length} of ${profileTotal} Entries`}
          </small>
        </div>
        <Paginate
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          pageCount={profilePageCount}
        />
        <DeleteConfirmation
          isOpen={isDelete}
          toggle={deleteToggle}
          totalRows={userToDelete.length}
          selectedRow={
            userToDelete?.length > 1
              ? userToDelete?.length + " users"
              : userToDelete[0]?.fullName
          }
          deleteHandler={deleteHandler}
        />
        <SuccessMessage
          isOpen={successModal}
          toggle={successToggle}
          noOfAdded={newAddedUsers}
          positionName={positionTitle}
        />
      </div>
    </>
  );
};

export default AssignedUsersIndex;
