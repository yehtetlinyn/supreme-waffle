import React, { useEffect, useMemo, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import commonStyles from "@/components/styles/commonStyles.module.css";
import tableStyles from "./assignedUsers.module.css";
import { renderCustomSortIcon } from "@/components/base/customSortIcon";

const AssignedUsersTable = (props) => {
  const [tableKey, setTableKey] = useState(true);

  useMemo(() => {
    setTableKey(!tableKey);
  }, [props?.userToDelete]);

  useEffect(() => {
    props?.setUserToDelete([]);
  }, [props?.userList]);

  const profileFormatter = (cell, row) => {
    return (
      <div>
        <img
          src={
            row?.photo?.url ||
            "/images/blank-profile-picture-geede3862d_1280.png"
          }
          alt="Profile-Picture"
        />
        <span>{cell}</span>
      </div>
    );
  };

  const customHeaderFormatter = (column, colIndex, components) => {
    return (
      <div className="d-flex align-items-center gap-3">
        {column.text}
        <div>{components.sortElement}</div>
      </div>
    );
  };

  const columns = [
    {
      dataField: "fullName",
      text: "Name",
      headerStyle: { minWidth: "40%" },
      style: { whiteSpace: "nowrap" },
      headerFormatter: customHeaderFormatter,
      sort: true,
      sortCaret: (order, column) => renderCustomSortIcon(order, column),
      formatter: profileFormatter,
    },
    {
      dataField: "user.email",
      text: "Email",
      headerStyle: { width: "60%" },
      style: { textAlign: "left" },
    },
  ];

  const handleRowSelect = (row, isSelect) => {
    props?.setUserToDelete((prevSelectedRows) => {
      if (isSelect) {
        return [...prevSelectedRows, row];
      } else {
        return prevSelectedRows.filter(
          (selectedRow) => selectedRow.id !== row.id
        );
      }
    });
  };

  const handleSelectAll = (isSelect, rows) => {
    if (isSelect) {
      props?.setUserToDelete(rows);
    } else {
      props?.setUserToDelete([]);
    }
  };

  const CustomCheckbox = ({ checked, onChange }) => (
    <div className={commonStyles.tableCheckBox}>
      <input type="checkbox" checked={checked} onChange={onChange} />
    </div>
  );

  const selectionHeaderRenderer = ({ mode, checked, indeterminate }) => (
    <CustomCheckbox
      checked={checked}
      onChange={() => handleSelectAll(!checked, props.userList)}
    />
  );

  const selectionRenderer = ({ mode, checked, onChange }) => (
    <CustomCheckbox checked={checked} onChange={() => {}} />
  );

  const selectRow = {
    mode: "checkbox",
    selected: props?.userToDelete?.map((row) => row.id),
    onSelect: handleRowSelect,
    onSelectAll: handleSelectAll,
    selectionHeaderRenderer: selectionHeaderRenderer,
    selectionRenderer: selectionRenderer,
  };

  return (
    <>
      <div className={`${commonStyles.tableWrapper} ${tableStyles.tableStyle}`}>
        <BootstrapTable
          bootstrap4
          key={tableKey}
          keyField="id"
          columns={columns}
          data={props?.userList}
          bordered={false}
          selectRow={selectRow}
          rowClasses={(row, rowIndex) =>
            props?.userToDelete?.some(
              (selectedRow) => selectedRow.id === row.id
            )
              ? commonStyles.selectedRow
              : commonStyles.tableRow
          }
        />
      </div>
    </>
  );
};

export default AssignedUsersTable;
