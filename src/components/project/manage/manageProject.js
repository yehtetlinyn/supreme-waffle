"use client";
import React, { useState } from "react";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { shallow } from "zustand/shallow";

import useProjectStore from "@/store/project";
import { DELETE_PROJECT, UPDATE_PROJECT } from "@/graphql/mutations/project";
import apolloClient from "@/lib/apolloClient";
import { useMutation } from "@apollo/client";

import ContentWrap from "@/components/contentWrap/page";
import ManageHeader from "@/components/manageLayout/manageHeader";
import ProjectFilter from "./projectFilter";
import Paginate from "@/components/pagination/page";
import ManageProjectTable from "./manageProjectTable";
import NoData from "@/components/noData/noData";
import Loading from "@/components/modals/loading";
import DeleteConfirmation from "@/components/modals/delete";

const pageSize = 10;

const ManageProject = () => {
  const router = useRouter();

  const searchParams = useSearchParams();
  const projectName = searchParams.get("name") || undefined;

  const [currentPage, setCurrentPage] = useState(1);

  const [selectedProjects, setSelectedProjects] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);

  const { getProjects, projectTitle, projectData, loading, total, pageCount } =
    useProjectStore(
      (state) => ({
        getProjects: state.getProjects,
        projectTitle: state.projectTitle,
        projectData: state.projectData,
        loading: state.loading,
        total: state.total,
        pageCount: state.pageCount,
      }),
      shallow
    );

  const fetchProjectData = async () => {
    await getProjects({
      projectName: projectName,
      deleted: false,
      currentPage: currentPage,
      pageSize: pageSize,
    });
  };

  useEffect(() => {
    fetchProjectData();
  }, [currentPage, projectName]);

  //If the fetched pagination is less than current page No.,
  //set current page to 1
  useMemo(() => {
    if (pageCount < currentPage) {
      setCurrentPage(pageCount);
    }
  }, [pageCount, projectData, total, deleteModal]);

  const [deleteProjectAction, { error: deleteError }] = useMutation(
    UPDATE_PROJECT,
    {
      client: apolloClient,
      onCompleted: (data) => {},
      onError: (error) => console.log(error),
    }
  );

  const deleteProjectHandler = async () => {
    try {
      await Promise.all(
        selectedProjects.map(async (project) => {
          await deleteProjectAction({
            variables: { id: project.id, data: { deleted: true } },
          });
        })
      );

      setDeleteModal(false);
      fetchProjectData();
      setSelectedProjects([]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <ContentWrap
        pageHeader={
          <ManageHeader
            title={"Project"}
            handleAddNew={() => router.push("/settings/project/create")}
            create={"Project"}
          />
        }
        filterRow={<ProjectFilter reset />}
        subTitle={"Total Projects"}
        listCount={loading ? "Loading..." : total}
        deleteBtn="Delete"
        deleteConfirmationModalHandler={() => setDeleteModal(!deleteModal)}
        disable={selectedProjects.length === 0}
        content={
          loading ? (
            <Loading />
          ) : projectData?.length > 0 ? (
            <ManageProjectTable
              tableData={projectData || []}
              selectedProjects={selectedProjects}
              setSelectedProjects={setSelectedProjects}
              setDeleteModal={setDeleteModal}
            />
          ) : (
            <div>
              <NoData />
            </div>
          )
        }
        totalCount={loading ? 0 : total}
        showingCount={loading ? 0 : projectData.length}
        loading={loading}
        footer={
          total > 0 && (
            <Paginate
              currentPage={currentPage || 1}
              setCurrentPage={setCurrentPage}
              pageCount={pageCount}
            />
          )
        }
      />
      <DeleteConfirmation
        isOpen={deleteModal}
        toggle={() => setDeleteModal(!deleteModal)}
        totalRows={selectedProjects.length}
        selectedRow={
          selectedProjects.length > 1
            ? `${selectedProjects.length} projects`
            : `${selectedProjects[0]?.name}`
        }
        deleteHandler={deleteProjectHandler}
      />
    </>
  );
};

export default ManageProject;
