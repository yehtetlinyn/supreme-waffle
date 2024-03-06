"use client";
import React, { useEffect, useState } from "react";
import ContentWrap from "../contentWrap/page";
import ManageHeader from "../manageLayout/manageHeader";
import ManageUserFilter from "./filter";
import ManageUserTable from "./manageUserTable";
import NoData from "../noData/noData";
import Paginate from "../pagination/page";
import useUsersStore from "@/store/user";
import Loading from "@/components/modals/loading";
import DeleteConfirmation from "../modals/delete";
import { useMutation } from "@apollo/client";
import { UPDATE_USER } from "@/graphql/mutations/user";
import apolloClient from "@/lib/apolloClient";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { shallow } from "zustand/shallow";

const ManageUserList = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const searchName = searchParams.get("name");

  const { getUsers, userInfo, total, pageCount, loading } = useUsersStore(
    (state) => ({
      getUsers: state.getUsers,
      userInfo: state.userInfo,
      total: state.total,
      pageCount: state.pageCount,
      loading: state.loading,
    }),
    shallow
  );

  const fetchUsersData = async () => {
    await getUsers({
      where: {
        userName: searchName || undefined,
        blocked: false,
        page: currentPage,
        pageSize: 10,
      },
    });
  };

  useEffect(() => {
    fetchUsersData();
  }, [searchName, currentPage]);

  useMemo(() => {
    if (pageCount < currentPage && !loading) setCurrentPage(pageCount);
  }, [pageCount]);

  const [updateUserAction] = useMutation(UPDATE_USER, {
    client: apolloClient,
    onCompleted: (data) => {},
    onError: (error) => console.log(error),
  });

  const deleteUserHandler = async () => {
    await Promise.all(
      selectedUsers?.map(async (user) => {
        const updatedUser = await updateUserAction({
          variables: {
            id: user.id,
            data: {
              blocked: true,
            },
          },
        });
      })
    );
    setDeleteModal(false);
    fetchUsersData();
    setSelectedUsers([]);
  };

  return (
    <>
      <ContentWrap
        pageHeader={
          <ManageHeader
            title={"User"}
            handleAddNew={() => router.push("/settings/manageUsers/create")}
            create={"User"}
          />
        }
        filterRow={<ManageUserFilter />}
        subTitle={"Total Users"}
        listCount={loading ? "Loading..." : total}
        deleteBtn={"Delete"}
        disable={selectedUsers.length === 0}
        deleteConfirmationModalHandler={() => setDeleteModal(true)}
        content={
          loading ? (
            <Loading />
          ) : userInfo?.length > 0 ? (
            <ManageUserTable
              tableData={userInfo || []}
              setDeleteModal={setDeleteModal}
              selectedUsers={selectedUsers}
              setSelectedUsers={setSelectedUsers}
            />
          ) : (
            <div>
              <NoData />
            </div>
          )
        }
        footer={
          total > 0 && (
            <Paginate
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              pageCount={pageCount}
            />
          )
        }
        totalCount={total}
        showingCount={userInfo?.length}
        loading={loading || userInfo?.length === 0}
      />
      <DeleteConfirmation
        isOpen={deleteModal}
        toggle={() => setDeleteModal(!deleteModal)}
        totalRows={selectedUsers.length}
        selectedRow={
          selectedUsers.length > 1
            ? `${selectedUsers.length} users`
            : `${selectedUsers[0]?.username}`
        }
        deleteHandler={deleteUserHandler}
      />
    </>
  );
};

export default ManageUserList;
