"use client";
import ManageHeader from "@/components/manageLayout/manageHeader";
import React, { useEffect, useState, useMemo } from "react";
import AnnouncementsListFilter from "./filter";
import NewsLists from "./list";
import ContentWrap from "@/components/contentWrap/page";
import Paginate from "@/components/pagination/page";
import { useRouter, useSearchParams } from "next/navigation";
import apolloClient from "@/lib/apolloClient";
import Loading from "@/components/modals/loading";
import DeleteConfirmation from "@/components/modals/delete";
import { DELETE_NEWS } from "@/graphql/mutations/news";
import { useMutation } from "@apollo/client";
import NoData from "@/components/noData/noData";
import useNewsStore from "@/store/newsStore";

const pageSize = 10;

const ManageNews = () => {
  const router = useRouter();
  const searchParam = useSearchParams();

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedNews, setSelectedNews] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);

  const toggleDeleteModal = () => setDeleteModal(!deleteModal);

  const filterInput = searchParam.get("search");

  const { fetch, loading, total, newsData, pageCount, handleRefresh, getNews } =
    useNewsStore((state) => ({
      fetch: state.fetch,
      loading: state.loading,
      total: state.total,
      newsData: state.newsData,
      pageCount: state.pageCount,
      handleRefresh: state.handleRefresh,
      getNews: state.getNews,
    }));

  const [deleteNewsAction] = useMutation(DELETE_NEWS, {
    client: apolloClient,
    onCompleted: (data) => {
      handleRefresh();
      if (
        (newsData?.length === 1 || selectedNews?.length === newsData?.length) &&
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

  const deleteNewsHandler = async () => {
    try {
      await Promise.all(
        selectedNews?.map(async (news) => {
          await deleteNewsAction({
            variables: { id: news.id },
          });
        })
      );
      setDeleteModal(false);
      setSelectedNews([]);
      getNews({
        filterInput: filterInput,
        currentPage: currentPage,
        pageSize: pageSize,
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getNews({
      filterInput: filterInput,
      currentPage: currentPage,
      pageSize: pageSize,
    });
  }, [filterInput, currentPage, fetch]);

  return (
    <>
      <ContentWrap
        subTitle={"Total News "}
        listCount={loading || !newsData ? "Loading..." : total || 0}
        pageHeader={
          <ManageHeader
            title={"News"}
            create={"News"}
            handleAddNew={() => router.push("/agency/news/create")}
          />
        }
        filterRow={<AnnouncementsListFilter />}
        content={
          loading || !newsData ? (
            <Loading />
          ) : newsData?.length > 0 ? (
            <NewsLists
              newsData={newsData}
              selectedNews={selectedNews}
              setSelectedNews={setSelectedNews}
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
        showingCount={newsData?.length}
        loading={loading || newsData?.length === 0}
        deleteBtn={"Delete"}
        deleteConfirmationModalHandler={deleteConfirmationModalHandler}
        disable={selectedNews?.length === 0}
      />
      <DeleteConfirmation
        isOpen={deleteModal}
        toggle={toggleDeleteModal}
        totalRows={selectedNews.length}
        selectedRow={
          selectedNews.length > 1
            ? `${selectedNews.length} news`
            : `${selectedNews[0]?.title}`
        }
        deleteHandler={deleteNewsHandler}
      />
    </>
  );
};

export default ManageNews;
