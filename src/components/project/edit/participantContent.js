import React, { useEffect, useState } from "react";

import styles from "../project.module.css";
import commonStyles from "../../styles/commonStyles.module.css";

import TabContentFilter from "./tabContentFilter";
import Paginate from "@/components/pagination/page";
import ManageUserTable from "@/components/manageUser/manageUserTable";
import { useParams, useSearchParams } from "next/navigation";
import { shallow } from "zustand/shallow";
import Loading from "@/components/modals/loading";
import NoData from "@/components/noData/noData";
import useUsersStore from "@/store/user";
import apolloClient from "@/lib/apolloClient";
import { GET_PROFILES } from "@/graphql/queries/profile";
import AddUsers from "@/components/positions/assignedusers/addUsers";
import { useMutation } from "@apollo/client";
import { UPDATE_PROJECT } from "@/graphql/mutations/project";
import { TbTrash } from "react-icons/tb";
import DeleteConfirmation from "@/components/modals/delete";
import useProjectStore from "@/store/project";
import SuccessMessage from "@/components/modals/success";

const ParticipantContent = () => {
  const params = useParams();
  const searchParam = useSearchParams();

  const searchName = searchParam.get("name");

  const [currentPage, setCurrentPage] = useState(1);
  const [otherUsers, setOtherUsers] = useState([]);
  const [existedUserIDs, setExistedUsersIDs] = useState([]);
  const [addUser, setAddUser] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [addUserCount, setAddUserCount] = useState(null);

  const { projectTitle, getProjectByID } = useProjectStore(
    (state) => ({
      projectTitle: state.projectTitle,
      getProjectByID: state.getProjectByID,
    }),
    shallow
  );

  const {
    getUsers,
    userInfo,
    total,
    pageCount,
    loading: userLoading,
  } = useUsersStore(
    (state) => ({
      getUsers: state.getUsers,
      userInfo: state.userInfo,
      total: state.total,
      pageCount: state.pageCount,
      loading: state.loading,
    }),
    shallow
  );

  //Fetch project data
  const fetchProject = async () => {
    await getProjectByID({
      id: params?.id,
      deleted: false,
    });
  };

  //Fetch users whoes related to current project
  const fetchRelatedUsers = async () => {
    getUsers({
      where: {
        userName: searchName || "",
        projectId: params.id,
        blocked: false,
        page: currentPage,
        pageSize: 10,
      },
    });
  };
  useEffect(() => {
    fetchRelatedUsers();
  }, [currentPage, searchName]);

  //Fetch users who are not related to current project
  const fetchOtherUsers = async () => {
    const { data: allUser } = await apolloClient.query({
      fetchPolicy: "network-only",
      query: GET_PROFILES,
      variables: {
        limit: -1,
        blocked: false,
      },
    });

    //Filter out profiles that don't have relation with current project
    setOtherUsers(
      allUser?.profiles.data?.filter(
        (user) =>
          !user.attributes.projects.data?.some(
            (project) => project.id === params.id
          )
      )
    );

    const existedUsers = allUser?.profiles.data?.filter((user) =>
      user.attributes.projects.data?.some((project) => project.id === params.id)
    );

    setExistedUsersIDs(existedUsers?.map((profile) => profile.id));
  };

  useEffect(() => {
    fetchOtherUsers();
    pageCount < currentPage && setCurrentPage(pageCount);
  }, [userInfo]);

  const [updateProject] = useMutation(UPDATE_PROJECT, {
    client: apolloClient,
    onCompleted: (data) => {
      fetchRelatedUsers();
    },
    onError: (error) => console.log("error", error),
  });

  //Add selected users with updating project table
  const addUserHandler = async (selectedUsers) => {
    // console.log("selectedUsers", selectedUsers);

    const selectedIDs = selectedUsers?.map((user) => user.id);
    const allIDs = [...existedUserIDs, ...selectedIDs];

    try {
      await updateProject({
        variables: {
          id: params.id,
          data: {
            profiles: allIDs,
          },
        },
      });

      fetchProject();
      setAddUserCount(selectedUsers.length);
      setSuccessModal(true);
    } catch (error) {
      console.log(error);
    }
  };

  const successToggle = () => {
    setSuccessModal(false);
    setAddUser(false);
    setAddUserCount(null);
  };

  const deleteToggle = () => {
    setSelectedUsers([]);
    setDeleteModal(false);
  };

  const deleteUserHandler = async () => {
    const selectedIDs = selectedUsers?.map((user) => user.profile.id);
    const updatedIDS = existedUserIDs?.filter(
      (id) => !selectedIDs?.includes(id)
    );

    await updateProject({
      variables: {
        id: params.id,
        data: {
          profiles: updatedIDS,
        },
      },
    });

    fetchProject();
    deleteToggle();
  };

  return (
    <>
      {successModal && (
        <SuccessMessage
          isOpen={successModal}
          toggle={successToggle}
          noOfAdded={addUserCount}
          positionName={projectTitle}
        />
      )}
      {deleteModal && (
        <DeleteConfirmation
          isOpen={deleteModal}
          toggle={deleteToggle}
          totalRows={selectedUsers.length}
          selectedRow={
            selectedUsers.length > 1
              ? `${selectedUsers.length} users`
              : `${selectedUsers[0]?.username}`
          }
          deleteHandler={deleteUserHandler}
        />
      )}
      <AddUsers
        isOpen={addUser}
        toggle={() => setAddUser(false)}
        otherUsers={otherUsers}
        addUserHandler={addUserHandler}
      />
      <div className={styles.tabContentWrap}>
        <div className={styles.tabContentHeader}>
          <TabContentFilter
            createBtn
            createText={"Add Participants"}
            handleCreate={() => setAddUser(true)}
          />
          <div className={styles.tabContentSubtitle}>
            Total Assign participants
            <span>{total}</span>
            {selectedUsers.length > 0 && (
              <div
                onClick={() => setDeleteModal(true)}
                className={commonStyles.deleteBtn}
                style={{ marginLeft: "auto" }}
              >
                <TbTrash size={18} />
                Delete
              </div>
            )}
          </div>
        </div>
        {userLoading ? (
          <Loading />
        ) : userInfo?.length === 0 ? (
          <div>
            <NoData />
          </div>
        ) : (
          <div style={{ overflow: "hidden scroll " }}>
            <ManageUserTable
              tableData={userInfo}
              selectedUsers={selectedUsers}
              setSelectedUsers={setSelectedUsers}
              setDeleteModal={setDeleteModal}
            />
          </div>
        )}
        <div className={styles.tabContentFooter} style={{ marginTop: "auto" }}>
          <span className={commonStyles.entriesText}>
            {`Showing ${userInfo?.length} of ${total} Entries`}
          </span>
          <Paginate
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            pageCount={pageCount}
          />
        </div>
      </div>
    </>
  );
};

export default ParticipantContent;
