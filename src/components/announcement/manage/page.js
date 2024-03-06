"use client";
import ManageHeader from "@/components/manageLayout/manageHeader";
import React, { useEffect, useState, useMemo } from "react";
import AnnouncementsListFilter from "./filter";
import AnnouncementLists from "./list";
import ContentWrap from "@/components/contentWrap/page";
import Paginate from "@/components/pagination/page";
import { useRouter, useSearchParams } from "next/navigation";
import apolloClient from "@/lib/apolloClient";
import Loading from "@/components/modals/loading";
import DeleteConfirmation from "@/components/modals/delete";
import { DELETE_ANNOUNCEMENTS } from "@/graphql/mutations/announcement";
import { useMutation } from "@apollo/client";
import NoData from "@/components/noData/noData";
import useAnnouncementStore from "@/store/announceStore";

const pageSize = 10;

const ManageAnnouncement = () => {
  const router = useRouter();
  const searchParam = useSearchParams();

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAnnouncements, setSelectedAnnouncements] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);

  const filterInput = searchParam.get("search");

  const {
    fetch,
    loading,
    total,
    pageCount,
    announcementData,
    handleRefresh,
    getAnnouncements,
  } = useAnnouncementStore((state) => ({
    fetch: state.fetch,
    loading: state.loading,
    total: state.total,
    pageCount: state.pageCount,
    announcementData: state.announcementData,
    handleRefresh: state.handleRefresh,
    getAnnouncements: state.getAnnouncements,
  }));

  const [deleteAnnouncementAction] = useMutation(DELETE_ANNOUNCEMENTS, {
    client: apolloClient,
    onCompleted: (data) => {
      handleRefresh();
      if (
        (announcementData?.length === 1 ||
          selectedAnnouncements?.length === announcementData?.length) &&
        currentPage > 1
      ) {
        setCurrentPage(currentPage - 1);
      }
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const deleteConfirmationModalHandler = () => {
    setDeleteModal(true);
  };

  const deleteAnnouncementHandler = async () => {
    try {
      await Promise.all(
        selectedAnnouncements?.map(async (announcement) => {
          await deleteAnnouncementAction({
            variables: { id: announcement.id },
          });
        })
      );
      setDeleteModal(false);
      setSelectedAnnouncements([]);
      getAnnouncements({
        filterInput: filterInput,
        currentPage: currentPage,
        pageSize: pageSize,
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getAnnouncements({
      filterInput: filterInput,
      currentPage: currentPage,
      pageSize: pageSize,
    });
  }, [filterInput, currentPage, fetch]);

  return (
    <>
      <ContentWrap
        subTitle={"Total Announcements "}
        listCount={loading || !announcementData ? "Loading..." : total}
        pageHeader={
          <ManageHeader
            title={"Announcements"}
            create={"Announcement"}
            handleAddNew={() => router.push("/agency/announcement/create")}
          />
        }
        filterRow={<AnnouncementsListFilter />}
        content={
          loading || !announcementData ? (
            <Loading />
          ) : announcementData?.length > 0 ? (
            <AnnouncementLists
              announcementData={announcementData}
              selectedAnnouncements={selectedAnnouncements}
              setSelectedAnnouncements={setSelectedAnnouncements}
              setDeleteModal={setDeleteModal}
            />
          ) : (
            <div>
              <NoData />
            </div>
          )
        }
        footer={
          <Paginate
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            pageCount={pageCount || 1}
          />
        }
        totalCount={total}
        showingCount={announcementData?.length}
        loading={loading || !announcementData}
        deleteBtn={"Delete"}
        deleteConfirmationModalHandler={deleteConfirmationModalHandler}
        disable={selectedAnnouncements?.length === 0}
      />
      <DeleteConfirmation
        isOpen={deleteModal}
        toggle={() => setDeleteModal(!deleteModal)}
        totalRows={selectedAnnouncements.length}
        selectedRow={
          selectedAnnouncements.length > 1
            ? `${selectedAnnouncements.length} announcements`
            : `${selectedAnnouncements[0]?.title}`
        }
        deleteHandler={deleteAnnouncementHandler}
      />
    </>
  );
};

export default ManageAnnouncement;
