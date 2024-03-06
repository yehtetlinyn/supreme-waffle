"use client";
import React, { useMemo, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import { useParams, useRouter } from "next/navigation";

import styles from "../../styles/commonStyles.module.css";
import tableStyle from "./managePosition.module.css";

import ActionMenu from "@/components/base/actionMenu";
import Link from "next/link";
import { renderCustomSortIcon } from "@/components/base/customSortIcon";
import useProfileStore from "@/store/profile";
import { shallow } from "zustand/shallow";
import apolloClient from "@/lib/apolloClient";
import { GET_PROFILES } from "@/graphql/queries/profile";

const PositionLists = ({
  tableData,
  setDeleteModal,
  selectedPositions,
  setSelectedPositions,
}) => {
  const router = useRouter();
  const [tableKey, setTableKey] = useState(true);
  const [expandDescription, setExpandDescription] = useState([]);

  useMemo(() => {
    setTableKey(!tableKey);
  }, [selectedPositions, expandDescription, tableData]);

  const actionFormatter = (cell, row, rowIndex) => {
    return (
      <>
        <ActionMenu
          viewAndEdit={true}
          deleteMenu={true}
          viewHandler={() => {
            router.push(`/settings/positions/view/${row?.id}`);
          }}
          deleteHandler={() => {
            setSelectedPositions([row]);
            setDeleteModal(true);
          }}
        />
      </>
    );
  };

  const descriptionFormatter = (cell, row, rowIndex) => {
    const onExpandHandler = () => {
      expandDescription.includes(row)
        ? setExpandDescription(
            expandDescription.filter((desc) => desc.id != row.id)
          )
        : setExpandDescription([...expandDescription, row]);
    };

    return (
      <>
        <div onClick={onExpandHandler} className={tableStyle.descExpand}>
          {expandDescription.includes(row)
            ? cell
            : cell.length > 90
            ? cell.substring(0, 90) + "..."
            : cell}
        </div>
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

  const noOfPeopleHeaderFormatter = (column, colIndex, components) => {
    return (
      <div className="d-flex align-items-center">
        <div className="m-auto">{column.text}</div>
        <div className="ml-auto"> {components.sortElement}</div>
      </div>
    );
  };

  const noOfPeopleFormatter = async (cell, row) => {
    const { data: allUser } = await apolloClient.query({
      fetchPolicy: "network-only",
      query: GET_PROFILES,
      variables: {
        positionId: row.id,
        limit: -1,
      },
    });
    const noOfPeople = allUser?.length;

    return (
      <Link href={`/settings/positions/view/${row?.id}/assignedusers`}>
        <span className={`${styles.blueText} ${styles.pointer}`}>
          {noOfPeople}
        </span>
      </Link>
    );
  };

  const columns = [
    {
      dataField: "name",
      text: "Position",
      headerStyle: { width: "25%" },
      headerFormatter: customHeaderFormatter,
      sort: true,
      sortCaret: (order, column) => renderCustomSortIcon(order, column),
      formatter: (cell, row) => {
        return (
          <Link href={`/settings/positions/view/${row?.id}`}>
            <span className={`${styles.blueText} ${styles.pointer}`}>
              {cell}
            </span>
          </Link>
        );
      },
    },
    {
      dataField: "description",
      text: "Description",
      headerStyle: { width: "40%" },
      headerFormatter: customHeaderFormatter,
      sort: true,
      sortCaret: (order, column) => renderCustomSortIcon(order, column),
      formatter: descriptionFormatter,
    },
    {
      dataField: "profiles",
      text: "No of People",
      style: { textAlign: "center" },
      headerFormatter: noOfPeopleHeaderFormatter,
      sort: true,
      sortCaret: (order, column) => renderCustomSortIcon(order, column),
      formatter: (cell, row) => {
        return (
          <Link href={`/settings/positions/view/${row?.id}/assignedusers`}>
            <span className={`${styles.blueText} ${styles.pointer}`}>
              {cell.length}
            </span>
          </Link>
        );
      },
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
      setSelectedPositions((prev) => [...prev, row]);
    } else {
      setSelectedPositions(
        selectedPositions?.filter((selectedRow) => selectedRow.id !== row.id)
      );
    }
  };

  const handleSelectAll = (isSelect, rows) => {
    if (isSelect) {
      setSelectedPositions(rows);
    } else {
      setSelectedPositions([]);
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
      onChange={() => handleSelectAll(!checked, tableData)}
    />
  );

  const selectionRenderer = ({ mode, checked, onChange }) => (
    <CustomCheckbox checked={checked} onChange={() => {}} />
  );

  const selectRow = {
    mode: "checkbox",
    selected: selectedPositions?.map((row) => row.id),
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
        data={tableData || []}
        bordered={false}
        selectRow={selectRow}
        rowClasses={(row, rowIndex) =>
          selectedPositions?.some((selectedRow) => selectedRow.id === row.id)
            ? tableStyle.selectedRow
            : tableStyle.tableRow
        }
      />
    </div>
  );
};

export default PositionLists;
