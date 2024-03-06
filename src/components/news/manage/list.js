"use client";
import React, { useMemo, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AiFillPushpin, AiOutlinePushpin } from "react-icons/ai";

import styles from "@/components/styles/commonStyles.module.css";
import tableStyle from "./style.module.css";
import ActionMenu from "@/components/base/actionMenu";
import { renderCustomSortIcon } from "@/components/base/customSortIcon";

const NewsLists = ({
  newsData,
  selectedNews,
  setSelectedNews,
  setDeleteModal,
}) => {
  const router = useRouter();

  const [tableKey, setTableKey] = useState(true);

  const deleteConfirmationModalHandler = (data) => {
    setDeleteModal(true);
    setSelectedNews([data]);
  };

  const viewNewsHandler = (id) => {
    router.push(`/agency/news/view/${id}`);
  };

  useMemo(() => {
    setTableKey(!tableKey);
  }, [selectedNews, newsData]);

  const pinFormatter = (cell, row, rowIndex) => {
    return (
      <div className={tableStyle.titleContainer}>
        {(cell && (
          <AiFillPushpin
            size={24}
            color="var(--primary-blue)"
            className={tableStyle.pin}
          />
        )) || (
          <AiOutlinePushpin
            size={24}
            color="var(--input-border)"
            className={tableStyle.pin}
          />
        )}
      </div>
    );
  };

  const actionFormatter = (cell, row, rowIndex) => {
    return (
      <>
        <ActionMenu
          viewAndEdit={true}
          deleteMenu={true}
          viewHandler={() => viewNewsHandler(row?.id)}
          deleteHandler={() => deleteConfirmationModalHandler(row)}
        />
      </>
    );
  };

  const customHeaderFormatter = (column, colIndex, components) => {
    return (
      <div className="d-flex justify-content-between align-items-center">
        {column.text} {components.sortElement}
      </div>
    );
  };

  const columns = [
    {
      dataField: "pinned",
      text: "Pin",
      headerStyle: { width: "5%", textAlign: "left" },
      style: { textAlign: "center" },
      formatter: pinFormatter,
    },
    {
      dataField: "title",
      text: "Title",
      headerStyle: { width: "25%" },
      headerFormatter: customHeaderFormatter,
      sort: true,
      sortCaret: (order, column) => renderCustomSortIcon(order, column),
      formatter: (cell, row) => {
        return (
          <div className={tableStyle.titleContainer}>
            <Link href={`/agency/news/view/${row?.id}`}>
              <span
                className={`${tableStyle.blueText} ${styles.blueText} ${styles.pointer}`}
              >
                {cell}
              </span>
            </Link>
          </div>
        );
      },
    },
    {
      dataField: "createdAt",
      text: "Date/Time Created",
      headerStyle: { width: "25%" },
      headerFormatter: customHeaderFormatter,
      sort: true,
      sortCaret: (order, column) => renderCustomSortIcon(order, column),
    },
    {
      dataField: "schedule",
      text: "News Schedule",
      headerStyle: { width: "40%", textAlign: "center" },
      headerFormatter: customHeaderFormatter,
      sort: true,
      sortCaret: (order, column) => renderCustomSortIcon(order, column),
    },
    {
      dataField: "action",
      text: "Action",
      headerStyle: { width: "10%", textAlign: "center" },
      style: { textAlign: "center" },
      formatter: actionFormatter,
    },
  ];

  const handleRowSelect = (row, isSelect) => {
    if (isSelect) {
      setSelectedNews((prev) => [...prev, row]);
    } else {
      setSelectedNews(
        selectedNews?.filter((selectedRow) => selectedRow.id !== row.id)
      );
    }
  };

  const handleSelectAll = (isSelect, rows) => {
    if (isSelect) {
      setSelectedNews(rows);
    } else {
      setSelectedNews([]);
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
      onChange={() => handleSelectAll(!checked, newsData)}
    />
  );

  const selectionRenderer = ({ mode, checked, onChange }) => (
    <CustomCheckbox checked={checked} onChange={() => {}} />
  );

  const selectRow = {
    mode: "checkbox",
    selected: selectedNews?.map((row) => row.id),
    onSelect: handleRowSelect,
    onSelectAll: handleSelectAll,
    selectionHeaderRenderer: selectionHeaderRenderer,
    selectionRenderer: selectionRenderer,
  };

  return (
    <div className={styles.tableWrapper}>
      <BootstrapTable
        bootstrap4
        key={tableKey}
        keyField="id"
        columns={columns}
        data={newsData || []}
        bordered={false}
        selectRow={selectRow}
        rowClasses={(row, rowIndex) =>
          selectedNews?.some((selectedRow) => selectedRow.id === row.id)
            ? tableStyle.selectedRow
            : tableStyle.tableRow
        }
      />
    </div>
  );
};

export default NewsLists;
