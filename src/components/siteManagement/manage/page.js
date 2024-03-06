"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { GET_SITES } from "@/graphql/queries/site";
import apolloClient from "@/lib/apolloClient";

import useSiteStore from "@/store/siteStore";

import FilterForm from "@/components/siteManagement/manage/filterForm";
import ManageHeader from "@/components/manageLayout/manageHeader";
import SiteTable from "@/components/siteManagement/manage/siteTable";
import Paginate from "@/components/pagination/page";
import ContentWrap from "@/components/contentWrap/page";
import Loading from "@/components/modals/loading";
import NoData from "@/components/noData/noData";
import usePageStore from "@/store/pageStore";

const pageSize = 10;
const SiteManagement = ({ siteOperations }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParam = useSearchParams();
  const filterInput = searchParam.get("search");

  const fetch = useSiteStore((state) => state.fetch);
  const handleRefresh = useSiteStore((state) => state.handleRefresh);
  const setIsSideBarClick = usePageStore((state) => state.setIsSideBarClick);

  const [loading, setLoading] = useState(false);
  const [siteData, setSiteData] = useState(null);

  const [total, setTotal] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedRows, setSelectedRows] = useState([]); // for selecting rows
  const [selectedSite, setSelectedSite] = useState([]); // for delete

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const toggleDeleteModalOpen = () => setIsDeleteModalOpen(!isDeleteModalOpen);

  // const [fetch, setFetch] = useState(null);
  // const handleRefresh = () => setFetch(uuid());

  const deleteConfirmationModalHandler = () => {
    toggleDeleteModalOpen();
    const selectedSiteToDelete = selectedRows?.map((row) => {
      return {
        id: row.id,
        name: row?.attributes?.name,
      };
    });
    setSelectedSite(selectedSiteToDelete);
  };
  const fetchSiteData = async () => {
    setLoading(true);
    const { data } = await apolloClient.query({
      fetchPolicy: "network-only",
      query: GET_SITES,
      variables: {
        name: filterInput || "",
        start: (currentPage - 1) * pageSize,
        limit: pageSize,
      },
    });

    if (data) {
      setSiteData(data?.sites?.data);
      setTotal(data?.sites?.meta?.pagination?.total);
      setPageCount(data?.sites?.meta?.pagination?.pageCount);
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    router.push(`${pathname}/createSite`);
    //setIsSideBarClick(false);
  };

  useEffect(() => {
    fetchSiteData();
  }, [fetch, filterInput, currentPage]);

  return (
    <ContentWrap
      subTitle={"Total Site"}
      listCount={
        loading || !siteData
          ? "Loading..."
          : !loading && siteData?.length === 0
          ? 0
          : total
      }
      pageHeader={
        <ManageHeader
          title={siteOperations ? "Site Operations" : "Site Settings"}
          handleAddNew={handleAddNew}
          create={!siteOperations ? "Site" : false}
        />
      }
      filterRow={<FilterForm />}
      content={
        loading || !siteData ? (
          <Loading />
        ) : siteData?.length > 0 ? (
          <SiteTable
            siteData={siteData}
            handleRefresh={handleRefresh}
            siteOperations={siteOperations}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            selectedSite={selectedSite}
            setSelectedSite={setSelectedSite}
            isDeleteModalOpen={isDeleteModalOpen}
            toggleDeleteModalOpen={toggleDeleteModalOpen}
          />
        ) : (
          <div>
            <NoData />
          </div>
        )
      }
      footer={
        total > 0 ? (
          <Paginate
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            pageCount={pageCount || 1}
          />
        ) : (
          false
        )
      }
      totalCount={total}
      showingCount={siteData?.length}
      loading={loading || siteData?.length === 0}
      deleteBtn={siteOperations ? false : "Delete"}
      deleteConfirmationModalHandler={deleteConfirmationModalHandler}
      disable={
        selectedRows?.length === 0 || siteData?.length === 0 ? true : false
      }
    />
  );
};

export default SiteManagement;
