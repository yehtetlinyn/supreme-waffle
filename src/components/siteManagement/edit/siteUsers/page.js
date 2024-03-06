import ContentWrap from "@/components/contentWrap/page";
import Paginate from "@/components/pagination/page";
import React, { useEffect, useState } from "react";
import UsersFilterForm from "@/components/siteManagement/edit/siteUsers/filterForm";
import commonStyles from "@/components/styles/commonStyles.module.css";
import SiteUsersTable from "./table";
import Loading from "@/components/modals/loading";
import NoData from "@/components/noData/noData";
import useSiteUserStore from "@/store/siteUserStore";
import { shallow } from "zustand/shallow";
import AddUsers from "./addUsers";
import { useParams } from "next/navigation";
import { useMutation } from "@apollo/client";
import { ASSIGN_USERS_TO_SITE } from "@/graphql/mutations/siteUser";
import apolloClient from "@/lib/apolloClient";
import SuccessMessage from "@/components/modals/success";
import ViewUser from "./viewUser";
import useSiteStore from "@/store/siteStore";

const SiteUsers = ({ currentPage, setCurrentPage }) => {
  const { id } = useParams();
  const [selectedRows, setSelectedRows] = useState([]); // for selecting rows from checkbox

  const [selectedUserData, setSelectedUserData] = useState([]); //for delete

  const [isAddUserPopoverOpen, setIsAddUserPopoverOpen] = useState(false);
  const togglePopoverOpen = () =>
    setIsAddUserPopoverOpen(!isAddUserPopoverOpen);

  const [successModal, setSuccessModal] = useState(false);
  const successToggle = () => {
    setSuccessModal(!successModal);
  };
  const [newAddedUsers, setNewAddedUsers] = useState(0);

  const [isViewUserPage, setIsViewUserPage] = useState(false);
  const toggleViewUserPage = () => setIsViewUserPage(!isViewUserPage);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const toggleDeleteModalOpen = () => setIsDeleteModalOpen(!isDeleteModalOpen);

  const siteName = useSiteStore((state) => state.siteName);

  const deleteConfirmationModalHandler = () => {
    toggleDeleteModalOpen();
    const selectedUserData = selectedRows?.map((row) => {
      return {
        id: row?.id,
        name: row?.fullName,
        siteName: row?.sites?.data[0]?.attributes?.name,
      };
    });
    setSelectedUserData(selectedUserData);
  };

  const {
    siteUsersData,
    loading,
    siteUsersCount,
    siteUserPageCount,
    fetchAllUsers,
    handleRefresh,
    fetch,
  } = useSiteUserStore(
    (state) => ({
      siteUsersData: state.siteUsersData,
      loading: state.loading,
      siteUsersCount: state.siteUsersCount,
      siteUserPageCount: state.siteUserPageCount,
      fetchAllUsers: state.fetchAllUsers,
      handleRefresh: state.handleRefresh,
      fetch: state.fetch,
    }),
    shallow
  );

  const [assignUserToSiteAction] = useMutation(ASSIGN_USERS_TO_SITE, {
    client: apolloClient,
    onCompleted: (data) => {
      console.log(data);
      handleRefresh();
      togglePopoverHandler();
      setSuccessModal(true);
    },
    onError: (error) => {
      console.log("error", error);
    },
  });

  const togglePopoverHandler = () => {
    togglePopoverOpen();
  };

  const addUserHandler = async (selectedUsers) => {
    setNewAddedUsers(selectedUsers?.length);
    const newUserIds = selectedUsers?.map((user) => user?.id);
    const oldUserIds = siteUsersData?.map((user) => user?.id);

    const profilesIds = oldUserIds.concat(newUserIds);

    await assignUserToSiteAction({
      variables: {
        siteId: id,
        profileIDs: profilesIds,
      },
    });
  };

  useEffect(() => {
    fetchAllUsers({ id });
  }, [fetch]);

  return (
    <>
      {isViewUserPage ? (
        <ViewUser
          selectedUserData={selectedUserData}
          toggleViewUserPage={toggleViewUserPage}
        />
      ) : (
        <>
          <ContentWrap
            form
            deleteBtn={"Remove"}
            deleteConfirmationModalHandler={deleteConfirmationModalHandler}
            disable={
              selectedRows?.length === 0 || siteUsersData?.length === 0
                ? true
                : false
            }
            subTitle={"Total Assigned Users"}
            listCount={siteUsersCount}
            filterRow={
              <>
                <div className="d-flex align-items-center justify-content-between">
                  <UsersFilterForm />
                  <div>
                    <button
                      className={commonStyles.addBtn}
                      onClick={togglePopoverHandler}
                      id="addButton"
                    >
                      Add Users to Site
                    </button>
                    {isAddUserPopoverOpen && (
                      <AddUsers
                        addUserHandler={addUserHandler}
                        togglePopoverHandler={togglePopoverHandler}
                        isAddUserPopoverOpen={isAddUserPopoverOpen}
                      />
                    )}
                  </div>
                </div>
              </>
            }
            content={
              loading || !siteUsersData ? (
                <Loading />
              ) : siteUsersData?.length > 0 ? (
                <SiteUsersTable
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  selectedRows={selectedRows}
                  setSelectedRows={setSelectedRows}
                  selectedUserData={selectedUserData}
                  setSelectedUserData={setSelectedUserData}
                  toggleViewUserPage={toggleViewUserPage}
                  isDeleteModalOpen={isDeleteModalOpen}
                  toggleDeleteModalOpen={toggleDeleteModalOpen}
                  siteName={siteName}
                />
              ) : (
                <div>
                  <NoData />
                </div>
              )
            }
            footer={
              siteUsersCount > 0 && (
                <Paginate
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  pageCount={siteUserPageCount || 1}
                />
              )
            }
            totalCount={siteUsersCount}
            showingCount={siteUsersData?.length}
            loading={loading || !siteUsersData}
          />

          {successModal && (
            <SuccessMessage
              isOpen={successModal}
              toggle={successToggle}
              noOfAdded={newAddedUsers}
              positionName={siteName}
            />
          )}
        </>
      )}
    </>
  );
};

export default SiteUsers;
