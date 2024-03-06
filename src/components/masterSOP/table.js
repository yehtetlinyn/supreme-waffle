"use client";
import React, { useCallback, useMemo, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import Link from "next/link";
import apolloClient from "@/lib/apolloClient";

import styles from "@/components/styles/commonStyles.module.css";
import ActionMenu from "../base/actionMenu";
import useMasterSOPStore from "@/store/masterSOPStore";
import DeleteConfirmation from "@/components/modals/delete";

import { RiDeleteBinLine } from "react-icons/ri";
import { useMutation } from "@apollo/client";
import { DELETE_SOP_MASTER } from "@/graphql/mutations/sopMaster";
import { usePathname, useRouter } from "next/navigation";
import useSiteSopStore from "@/store/siteSopStore";
import { shallow } from "zustand/shallow";
import { DELETE_SITE_SOP } from "@/graphql/mutations/siteSop";
import { extractPageName } from "@/utils/helpers";

const MasterSOPTable = ({
  setCurrentPage,
  currentPage,
  siteSop = false,
  setIsView,
  selectedRows,
  setSelectedRows,
  selectedSop,
  setSelectedSop,
  isDeleteModalOpen,
  toggleDeleteModalOpen,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const pageName =
    extractPageName(pathname, 1) + "/" + extractPageName(pathname, 2);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [tableKey, setTableKey] = useState(true);

  useMemo(() => {
    setTableKey(!tableKey);
  }, [selectedRows, hoveredRow]);

  // maste sop store
  const masterSOPData = useMasterSOPStore((state) => state.masterSOPData);
  const handleRefresh = useMasterSOPStore((state) => state.handleRefresh);

  // site sop store
  const {
    siteSopData,
    handleRefresh: siteSopRefresh,
    setCopyMasterSopData: setSelectedSiteSopData,

    setIsSiteSopModalOpen,
  } = useSiteSopStore(
    (state) => ({
      siteSopData: state.siteSopData,
      handleRefresh: state.handleRefresh,
      setCopyMasterSopData: state.setCopyMasterSopData,
      setIsSiteSopModalOpen: state.setIsSiteSopModalOpen,
    }),
    shallow
  );

  //for edit button
  const actionHandler = (id, action) => {
    router.push(`/${pageName}/${action}/${id}`);
  };

  // for delete confirmation open
  const deleteConfirmationModalHandler = (data) => {
    toggleDeleteModalOpen();
    setSelectedSop([{ id: data.id, name: data?.name }]);
  };

  //delete function for master sop
  const [deleteMasterSOPAction, { loading, error }] = useMutation(
    DELETE_SOP_MASTER,
    {
      client: apolloClient,
      onCompleted: () => {
        if (
          (masterSOPData?.length === 1 ||
            selectedRows.length === masterSOPData?.length) &&
          currentPage > 1
        ) {
          setCurrentPage(currentPage - 1);
        }
      },
      onError: (error) => {
        console.log("error", error);
      },
    }
  );

  //delete function for site sop
  const [
    deleteSiteSopAction,
    { loading: siteSopDeleteLoading, error: siteSopError },
  ] = useMutation(DELETE_SITE_SOP, {
    client: apolloClient,
    onCompleted: () => {
      if (
        (siteSopData?.length === 1 ||
          selectedRows.length === siteSopData?.length) &&
        currentPage > 1
      ) {
        setCurrentPage(currentPage - 1);
      }
    },
    onError: (error) => {
      console.log("error", error);
    },
  });

  const deleteSOPHandler = async () => {
    for (const sop of selectedSop) {
      if (siteSop) {
        await deleteSiteSopAction({
          variables: {
            id: sop.id,
          },
        });
        if (siteSopError) break;
      } else {
        await deleteMasterSOPAction({
          variables: {
            id: sop.id,
          },
        });
        if (error) break;
      }
    }
    if (siteSop) {
      toggleDeleteModalOpen();
      siteSopRefresh();
    } else {
      toggleDeleteModalOpen();
      handleRefresh();
    }
    setSelectedRows([]);
  };

  const actionFormatter = (cell, row, rowIndex) => {
    return (
      <>
        <ActionMenu
          siteSop={siteSop}
          viewAndEdit={true}
          deleteMenu={true}
          deleteHandler={() => deleteConfirmationModalHandler(row)}
          viewHandler={() => {
            if (siteSop) {
              setIsSiteSopModalOpen(true);
              setSelectedSiteSopData(row);
            } else {
              actionHandler(row.id, "view");
            }
          }}
          id={row.id}
        />
      </>
    );
  };

  const columns = [
    {
      dataField: "name",
      text: "SOP Name",
      formatter: (cell, row) => {
        return (
          <>
            {siteSop ? (
              <span
                className={`${styles.blueText} ${styles.pointer}`}
                onClick={() => {
                  setIsSiteSopModalOpen(true);
                  setSelectedSiteSopData(row);
                }}
              >
                {cell}
              </span>
            ) : (
              <Link
                href={{
                  pathname: `${pathname}/view/${row.id}`,
                }}
              >
                <span className={`${styles.blueText} ${styles.pointer}`}>
                  {cell}
                </span>
              </Link>
            )}
          </>
        );
      },
    },
    {
      dataField: "incident.data.attributes.name",
      text: "Incident Type",
    },
    { dataField: "impact", text: "Impact" },
    {
      dataField: "priority",
      text: "Priority",
      formatter: (cell) => {
        return (
          <span
            style={{
              color:
                cell === "High" || cell === "Urgent"
                  ? "var(--text-red)"
                  : cell === "Medium"
                  ? "var(--text-orange)"
                  : cell === "Low"
                  ? "var(--primary-yellow)"
                  : "",
            }}
          >
            {cell}
          </span>
        );
      },
    },
    {
      dataField: "",
      text: "Action",
      headerStyle: { textAlign: "center" },
      style: { textAlign: "center" },
      formatter: actionFormatter,
    },
  ];

  const handleRowMouseEnter = (row, rowIndex) => {
    setHoveredRow(rowIndex);
  };

  const handleRowMouseLeave = () => {
    setHoveredRow(null);
  };

  const handleRowSelect = (row, isSelect) => {
    if (isSelect) {
      setSelectedRows([...selectedRows, row]);
    } else {
      setSelectedRows(
        selectedRows.filter((selectedRow) => selectedRow.id !== row.id)
      );
    }
  };

  const handleSelectAll = (isSelect, rows) => {
    if (isSelect) {
      setSelectedRows(rows);
    } else {
      setSelectedRows([]);
    }
  };

  const CustomCheckbox = ({ checked, onChange }) => (
    <div className={styles.tableCheckBox}>
      <input type="checkbox" checked={checked} onChange={onChange} />
    </div>
  );

  const selectionHeaderRenderer = ({ mode, checked, indeterminate }) => (
    <CustomCheckbox
      checked={checked}
      onChange={() =>
        handleSelectAll(!checked, siteSop ? siteSopData : masterSOPData)
      }
    />
  );

  const selectionRenderer = ({ mode, checked, onChange }) => (
    <CustomCheckbox checked={checked} onChange={() => {}} />
  );

  const selectRow = {
    mode: "checkbox",
    selected: selectedRows.map((row) => row.id),
    onSelect: handleRowSelect,
    onSelectAll: handleSelectAll,
    selectionHeaderRenderer: selectionHeaderRenderer,
    selectionRenderer: selectionRenderer,
  };
  return (
    <>
      <div className={styles.tableWrapper}>
        <BootstrapTable
          bootstrap4
          key={tableKey}
          keyField="id"
          columns={columns}
          data={(siteSop ? siteSopData : masterSOPData) || []}
          bordered={false}
          selectRow={selectRow}
          rowClasses={(row, rowIndex) =>
            selectedRows?.some((selectedRow) => selectedRow.id === row.id)
              ? styles.selectedRow
              : styles.tableRow
          }
          rowEvents={{
            onMouseEnter: (e, row, rowIndex) =>
              handleRowMouseEnter(row, rowIndex),
            onMouseLeave: (e, row, rowIndex) => handleRowMouseLeave(),
          }}
        />
      </div>
      {isDeleteModalOpen && (
        <DeleteConfirmation
          isOpen={isDeleteModalOpen}
          toggle={toggleDeleteModalOpen}
          selectedRow={
            selectedSop?.length > 1
              ? `${selectedSop?.length} SOPs`
              : `${selectedSop[0]?.name}`
          }
          deleteHandler={deleteSOPHandler}
          loading={loading || siteSopDeleteLoading}
          totalRows={selectedSop?.length}
        />
      )}
    </>
  );
};

export default MasterSOPTable;
