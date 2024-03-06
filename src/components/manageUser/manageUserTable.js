import React, { useEffect, useMemo, useState } from "react";
import commonStyle from "../styles/commonStyles.module.css";
import BootstrapTable from "react-bootstrap-table-next";
import { useRouter } from "next/navigation";
import ActionMenu from "../base/actionMenu";
import { RiDeleteBinLine } from "react-icons/ri";
import Image from "next/image";
import Link from "next/link";
import { renderCustomSortIcon } from "../base/customSortIcon";

const options = { day: "2-digit", month: "short", year: "numeric" };

const ManageUserTable = ({
  tableData,
  selectedUsers,
  setSelectedUsers,
  setDeleteModal,
}) => {
  const router = useRouter();
  const [tableKey, setTableKey] = useState(true);

  useMemo(() => {
    setTableKey(!tableKey);
  }, [selectedUsers]);

  const nameFormatter = (cell, row, rowIndex) => {
    return (
      <>
        <Image
          src={
            row.profile.photo?.url ||
            "/images/blank-profile-picture-geede3862d_1280.png"
          }
          width={30}
          height={30}
          style={{ borderRadius: "50%", marginRight: 10 }}
          alt="Profile Image"
        />
        <Link href={`/settings/manageUsers/view/${row.id}`}>{cell}</Link>
      </>
    );
  };

  const actionFormatter = (cell, row, rowIndex) => {
    return (
      <>
        <ActionMenu
          deleteMenu={true}
          viewAndEdit={true}
          viewHandler={() => {
            router.push(`/settings/manageUsers/view/${row?.id}`);
          }}
          deleteHandler={() => {
            setSelectedUsers([row]);
            setDeleteModal(true);
          }}
        />
      </>
    );
  };

  const customHeaderFormatter = (column, colIndex, components) => {
    return (
      <div className="d-flex align-items-center">
        {column.text}
        {components.sortElement}
      </div>
    );
  };

  const columns = [
    {
      dataField: "username",
      text: "Name",
      style: { whiteSpace: "nowrap", color: "#599CFF" },
      headerFormatter: customHeaderFormatter,
      sort: true,
      sortCaret: (order, column) => renderCustomSortIcon(order, column),
      formatter: nameFormatter,
    },
    {
      dataField: "email",
      text: "Email",
      headerFormatter: customHeaderFormatter,
      sort: true,
      sortCaret: (order, column) => renderCustomSortIcon(order, column),
    },
    {
      dataField: "profile.joinedDate",
      text: "Join Date",
      headerFormatter: customHeaderFormatter,
      sort: true,
      sortCaret: (order, column) => renderCustomSortIcon(order, column),
      formatter: (cell, row) => {
        return (
          <soan>
            {cell ? new Date(cell).toLocaleDateString("en-US", options) : "-"}
          </soan>
        );
      },
    },
    {
      dataField: "profile.position.name",
      text: "Position",
      headerFormatter: customHeaderFormatter,
      sort: true,
      sortCaret: (order, column) => renderCustomSortIcon(order, column),
      formatter: (cell, row) => {
        return <soan>{cell ? cell : "-"}</soan>;
      },
    },
    {
      dataField: "action",
      text: "Action",
      headerStyle: { textAlign: "center" },
      formatter: actionFormatter,
    },
  ];

  const handleRowSelect = (row, isSelect) => {
    if (isSelect) {
      setSelectedUsers([...selectedUsers, row]);
    } else {
      setSelectedUsers(
        selectedUsers?.filter((selectedRow) => selectedRow.id !== row.id)
      );
    }
  };

  const handleSelectAll = (isSelect, rows) => {
    if (isSelect) {
      setSelectedUsers(rows);
    } else {
      setSelectedUsers([]);
    }
  };

  const CustomCheckbox = ({ checked, onChange }) => (
    <div className={commonStyle.tableCheckBox}>
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
    selected: selectedUsers?.map((row) => row.id),
    onSelect: handleRowSelect,
    onSelectAll: handleSelectAll,
    selectionHeaderRenderer: selectionHeaderRenderer,
    selectionRenderer: selectionRenderer,
  };

  return (
    <div className={commonStyle.tableWrapper}>
      <BootstrapTable
        bootstrap4
        key={tableKey}
        keyField="id"
        bordered={false}
        columns={columns}
        data={tableData}
        selectRow={selectRow}
        rowClasses={(row, rowIndex) =>
          selectedUsers?.some((selectedRow) => selectedRow.id === row.id)
            ? commonStyle.selectedRow
            : commonStyle.tableRow
        }
      />
    </div>
  );
};

export default ManageUserTable;
