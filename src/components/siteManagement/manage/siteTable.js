"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

import apolloClient from "@/lib/apolloClient";
import { useMutation } from "@apollo/client";
import { DELETE_SITE } from "@/graphql/mutations/site";

import Link from "next/link";
import BootstrapTable from "react-bootstrap-table-next";

import styles from "@/components/styles/commonStyles.module.css";
import siteModuleStyles from "@/components/siteManagement/site.module.css";
import ActionMenu from "@/components/base/actionMenu";
import DeleteModal from "@/components/modals/delete";
import { renderCustomSortIcon } from "@/components/base/customSortIcon";
const SiteTable = ({
  siteData,
  handleRefresh,
  siteOperations,
  currentPage,
  setCurrentPage,
  selectedRows,
  setSelectedRows,
  selectedSite,
  setSelectedSite,
  isDeleteModalOpen,
  toggleDeleteModalOpen,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  // make text overflow
  const [isDescCollapse, setIsDescCollapse] = useState({});
  const toggleDescCollapse = (rowIndex) => {
    setIsDescCollapse((prev) => ({
      ...prev,
      [rowIndex]: !isDescCollapse[rowIndex],
    }));
  };
  // for edit button
  const viewHandler = (id) => {
    router.push(`${pathname}/view/${id}`);
  };

  const handleViewShiftSchedule = (id) => {
    router.push(`/site/${id}/shift-schedule`);
  };

  // for delete confirmation open
  const deleteConfirmationModalHandler = (data) => {
    toggleDeleteModalOpen();
    setSelectedSite([{ id: data.id, name: data?.attributes?.name }]);
  };

  // delete function
  const [deleteSiteAction, { loading, error }] = useMutation(DELETE_SITE, {
    client: apolloClient,
    onCompleted: (data) => {
      console.log("deleted");
    },
    onError: (error) => {
      console.log("error", error);
    },
  });

  const deleteSiteHandler = async () => {
    let count = 0;
    for (const site of selectedSite) {
      await deleteSiteAction({
        variables: {
          id: site?.id,
          isDelete: true,
        },
      });
      count++;
      if (error) break;
    }
    if (count == selectedSite?.length) {
      toggleDeleteModalOpen();
      handleRefresh();
      setSelectedRows([]);
      if (
        (siteData?.length === 1 || selectedRows?.length === siteData?.length) &&
        currentPage > 1
      ) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  // action dropdown menu
  const actionFormatter = (cell, row) => (
    <>
      <ActionMenu
        viewAndEdit={true}
        deleteMenu={true}
        createShift={true}
        createCheckPoint={true}
        createSop={true}
        createUser={true}
        viewHandler={() => viewHandler(row.id)}
        deleteHandler={() => deleteConfirmationModalHandler(row)}
        id={row.id}
      />
    </>
  );

  const customHeaderFormatter = (column, colIndex, components) => {
    return (
      <div className="d-flex justify-content-between align-items-center">
        {column.text} {components.sortElement}
      </div>
    );
  };
  const columns = [
    {
      dataField: "attributes.name",
      text: "Name",
      headerStyle: {
        minWidth: "200px",
      },
      headerFormatter: customHeaderFormatter,
      sort: true,
      sortCaret: (order, column) => renderCustomSortIcon(order, column),
      formatter: (cell, row) => {
        return (
          <Link
            href={{
              pathname: `${pathname}/view/${row.id}`,
            }}
          >
            <span className={`${styles.blueText} ${styles.pointer}`}>
              {cell}
            </span>
          </Link>
        );
      },
    },
    {
      dataField: "attributes.address",
      text: "Address",
      headerFormatter: customHeaderFormatter,
      headerStyle: { minWidth: "300px" },
      sort: true,
      sortCaret: (order, column) => renderCustomSortIcon(order, column),
    },
    {
      dataField: "attributes.contacts.Telephone",
      text: "Contact No",
      sort: true,
      headerStyle: { minWidth: "200px" },
      headerFormatter: customHeaderFormatter,
      sortCaret: (order, column) => renderCustomSortIcon(order, column),
    },
    {
      dataField: "attributes.description",
      text: "Description",
      headerStyle: { minWidth: "300px" },
      sort: !siteOperations ? true : false,
      headerFormatter: customHeaderFormatter,
      sortCaret: (order, column) => renderCustomSortIcon(order, column),
      formatExtraData: {
        isDescCollapse,
        setIsDescCollapse,
      },
      formatter: (cell, row, rowIndex, formatExtraData) => {
        // make all rows as collapse at initial state
        if (isDescCollapse[rowIndex] === undefined) {
          //toggle(formatExtraData, rowIndex);
          setIsDescCollapse((prev) => ({
            ...prev,
            [rowIndex]: true,
          }));
        }

        return (
          <div
            className={
              formatExtraData?.isDescCollapse[rowIndex] == true
                ? siteModuleStyles.descCollapse
                : siteModuleStyles.descNotCollapse
            }
            onClick={() => toggleDescCollapse(rowIndex)}
          >
            <span>{cell}</span>
          </div>
        );
      },
    },

    !siteOperations && {
      dataField: "actions",
      text: "Actions",
      headerStyle: { textAlign: "center" },
      formatter: actionFormatter,
    },
  ];

  // const handleRowMouseEnter = (row, rowIndex) => {
  //   setHoveredRow(rowIndex);
  // };

  // const handleRowMouseLeave = () => {
  //   setHoveredRow(null);
  // };

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
      onChange={() => handleSelectAll(!checked, siteData)}
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
          keyField="id"
          columns={columns}
          data={siteData || []}
          bordered={false}
          selectRow={!siteOperations ? selectRow : undefined}
          rowClasses={(row, rowIndex) =>
            selectedRows?.some((selectedRow) => selectedRow?.id === row?.id)
              ? styles.selectedRow
              : styles.tableRow
          }
        />
      </div>
      <DeleteModal
        isOpen={isDeleteModalOpen}
        toggle={toggleDeleteModalOpen}
        selectedRow={
          selectedSite?.length > 1
            ? `${selectedSite?.length} Sites`
            : `${selectedSite[0]?.name}`
        }
        deleteHandler={deleteSiteHandler}
        loading={loading}
        totalRows={selectedSite?.length}
      />
    </>
  );
};

export default SiteTable;
