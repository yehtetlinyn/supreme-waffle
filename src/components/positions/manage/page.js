import ManageHeader from "@/components/manageLayout/manageHeader";
import React, { useEffect, useMemo, useState } from "react";
import PositionsListFilter from "./filter";
import PositionLists from "./list";
import ContentWrap from "@/components/contentWrap/page";
import Paginate from "@/components/pagination/page";
import { useRouter, useSearchParams } from "next/navigation";
import apolloClient from "@/lib/apolloClient";
import Loading from "@/components/modals/loading";
import DeleteConfirmation from "@/components/modals/delete";
import {
  DELETE_POSITIONS,
  UPDATE_POSITIONS,
} from "@/graphql/mutations/positions";
import { useMutation } from "@apollo/client";
import NoData from "@/components/noData/noData";
import usePositionStore from "@/store/position";
import { shallow } from "zustand/shallow";

const pageSize = 10;

const ManagePositions = () => {
  const router = useRouter();
  const searchParam = useSearchParams();

  const { getPositions, positionInfo, loading, total, pageCount } =
    usePositionStore(
      (state) => ({
        getPositions: state.getPositions,
        positionInfo: state.positionInfo,
        loading: state.loading,
        total: state.total,
        pageCount: state.pageCount,
      }),
      shallow
    );

  const [selectedPositions, setSelectedPositions] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);

  const filterInput = searchParam.get("search");

  const [currentPage, setCurrentPage] = useState(1);

  const fetchPositinsData = async () => {
    await getPositions({
      where: {
        name: filterInput || undefined,
        deleted: false,
        profileLimit: -1,
        pageNum: currentPage,
        pageSize: pageSize,
      },
    });
  };

  useEffect(() => {
    fetchPositinsData();
  }, [filterInput, currentPage]);

  useMemo(() => {
    if (pageCount < currentPage && !loading) {
      setCurrentPage(pageCount);
    }
  }, [pageCount, positionInfo]);

  const [updatePositionAction, { error: deleteError }] = useMutation(
    UPDATE_POSITIONS,
    {
      client: apolloClient,
      onError: (error) => console.log(error),
    }
  );

  const deleteConfirmationModalHandler = () => {
    setDeleteModal(true);
  };

  const deletePositionHandler = async () => {
    try {
      await Promise.all(
        selectedPositions?.map(async (position) => {
          await updatePositionAction({
            variables: {
              id: position.id,
              data: {
                deleted: true,
              },
            },
          });
        })
      );
      setDeleteModal(false);
      setSelectedPositions([]);
      fetchPositinsData();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <ContentWrap
        subTitle={"Total Positions"}
        listCount={loading ? "Loading..." : total}
        deleteBtn="Delete"
        disable={selectedPositions?.length === 0}
        deleteConfirmationModalHandler={deleteConfirmationModalHandler}
        pageHeader={
          <ManageHeader
            title={"Positions"}
            create={"Position"}
            handleAddNew={() => router.push("/settings/positions/create")}
          />
        }
        filterRow={<PositionsListFilter />}
        content={
          loading ? (
            <Loading />
          ) : positionInfo?.length > 0 ? (
            <PositionLists
              tableData={positionInfo}
              selectedPositions={selectedPositions}
              setSelectedPositions={setSelectedPositions}
              setDeleteModal={setDeleteModal}
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
        showingCount={positionInfo?.length}
        loading={loading}
      />
      <DeleteConfirmation
        isOpen={deleteModal}
        toggle={() => setDeleteModal(!deleteModal)}
        totalRows={selectedPositions?.length}
        selectedRow={
          selectedPositions?.length > 1
            ? `${selectedPositions?.length} positions`
            : `${selectedPositions[0]?.name}`
        }
        deleteHandler={deletePositionHandler}
      />
    </>
  );
};

export default ManagePositions;
