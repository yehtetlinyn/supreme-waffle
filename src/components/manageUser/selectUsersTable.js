import React, { useMemo, useState } from "react";
import commonStyle from "../styles/commonStyles.module.css";
import BootstrapTable from "react-bootstrap-table-next";
import { AiOutlineCheck } from "react-icons/ai";
import Image from "next/image";

const SelectUsersTable = ({ tableData, selectedUsers, setSelectedUsers }) => {
  const [tableKey, setTableKey] = useState(true);
  const selectableRows = tableData.filter((row) => row.existed === "false");

  useMemo(() => {
    setTableKey(!tableKey);
  }, [selectedUsers]);

  const columns = [
    {
      dataField: "image_url",
      text: "Facial Scan Image",
      headerStyle: { width: 200 },
      formatter: (cell, row) => {
        return (
          <Image
            alt="facial-image"
            src={cell || "/images/blank-profile-picture-geede3862d_1280.png"}
            width={40}
            height={40}
          />
        );
      },
    },
    {
      dataField: "first_name",
      text: "First Name",
    },
    {
      dataField: "last_name",
      text: "Last Name",
    },
    {
      dataField: "email",
      text: "Email",
    },
    {
      dataField: "existed",
      text: "Use Existed",
      headerStyle: { width: 150 },
      formatter: (cell, row) => {
        if (cell === "true") {
          return <AiOutlineCheck color="var(--primary-yellow)" />;
        }
      },
    },
  ];

  const handleRowSelect = (row, isSelect) => {
    if (isSelect) {
      setSelectedUsers([...selectedUsers, row]);
    } else {
      setSelectedUsers((prevSelected) =>
        prevSelected.filter((selectedUser) => selectedUser.email !== row.email)
      );
    }
  };

  const handleSelectAll = (isSelect, rows) => {
    const isSelectAll = isSelect;
    if (isSelectAll && selectedUsers.length < selectableRows.length) {
      setSelectedUsers(selectableRows);
      // return selectableRows;
    } else {
      setSelectedUsers([]);
      // return [];
    }
  };

  const CustomCheckbox = ({ checked, onChange }) => (
    <div className={commonStyle.tableCheckBox}>
      <input type="checkbox" checked={checked} onChange={onChange} />
    </div>
  );

  const selectionHeaderRenderer = ({ mode, checked, indeterminate }) => {
    return (
      <CustomCheckbox
        checked={selectedUsers.length >= selectableRows.length}
        onChange={() => handleSelectAll(!checked, tableData)}
      />
    );
  };

  const selectionRenderer = ({ mode, checked, onChange, row }) => (
    <CustomCheckbox checked={checked} onChange={() => {}} />
  );

  const selectRow = {
    mode: "checkbox",
    selected: selectedUsers.map((row) => row.email),
    nonSelectable: tableData?.map(
      (row, index) => row?.existed === "true" && row?.email
    ),
    nonSelectableClasses: commonStyle.disabledRow,
    onSelect: handleRowSelect,
    onSelectAll: handleSelectAll,
    selectionHeaderRenderer: selectionHeaderRenderer,
    selectionRenderer: selectionRenderer,
  };

  const rowClasses = (row) => {
    if (selectedUsers.some((selectedRow) => selectedRow.email === row.email)) {
      return commonStyle.selectedRow;
    } else if (row?.existed === true) {
      return commonStyle.disabledRow;
    } else {
      return commonStyle.tableRow;
    }
  };

  return (
    <div className={commonStyle.tableWrapper}>
      <BootstrapTable
        bootstrap4
        key={tableKey}
        keyField="email"
        bordered={false}
        columns={columns}
        data={tableData}
        selectRow={selectRow}
        rowClasses={rowClasses}
      />
    </div>
  );
};

export default SelectUsersTable;
