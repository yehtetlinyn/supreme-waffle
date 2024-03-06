"use client";
import React, { useMemo, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import commonStyle from "../../styles/commonStyles.module.css";
import { useParams, useRouter } from "next/navigation";
import ActionMenu from "@/components/base/actionMenu";
import { RiDeleteBinLine } from "react-icons/ri";
import Image from "next/image";
import { renderCustomSortIcon } from "@/components/base/customSortIcon";

const AssignedUserList = ({
  tableData,
  setDeleteModal,
  selectedCertificateProfile,
  setSelectedCertificateProfile,
}) => {
  const params = useParams();
  const router = useRouter();
  const [tableKey, setTableKey] = useState(true);

  useMemo(() => {
    setTableKey(!tableKey);
  }, [selectedCertificateProfile]);

  useMemo(() => {
    setSelectedCertificateProfile([]);
  }, tableData);

  const actionFormatter = (cell, row, rowIndex) => {
    return (
      <>
        <ActionMenu
          edit={true}
          deleteMenu={true}
          editHandler={() => {
            router.push(
              `/settings/certifications/view/${params?.id}/assignuser/edit/${row?.id}`
            );
          }}
          deleteHandler={() => {
            setSelectedCertificateProfile([row]);
            setDeleteModal(true);
          }}
        />
      </>
    );
  };

  const teamMemberFormatter = (cell, row, rowIndex) => {
    return (
      <div style={{ display: "flex" }}>
        {cell?.slice(0, 3).map((user, index) => (
          <Image
            src={
              user.photo.url ||
              "/images/blank-profile-picture-geede3862d_1280.png"
            }
            alt="profile-picture"
            width={30}
            height={30}
            style={{
              borderRadius: "50%",
              marginRight: "-10px",
              border: "1px solid white",
            }}
          />
        ))}
        {cell?.length > 3 && (
          <div
            style={{
              height: 30,
              width: 30,
              borderRadius: "50%",
              marginRight: "-10px",
              border: "1px solid white",
              background: "#89D47E ",
              color: "white",
              fontSize: "14px",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {`${cell?.length - 3}+`}
          </div>
        )}
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
      dataField: "profiles",
      text: "Team Members",
      headerStyle: { whiteSpace: "nowrap" },
      sort: true,
      headerFormatter: customHeaderFormatter,
      sortCaret: (order, column) => renderCustomSortIcon(order, column),
      formatter: teamMemberFormatter,
    },
    {
      dataField: "expirationDate",
      text: "Expiry Date",
      headerStyle: { whiteSpace: "nowrap" },
      style: { whiteSpace: "nowrap" },
      sort: true,
      headerFormatter: customHeaderFormatter,
      sortCaret: (order, column) => renderCustomSortIcon(order, column),
    },
    {
      dataField: "issueDate",
      text: "Issue Date",
      headerStyle: { whiteSpace: "nowrap" },
      style: { whiteSpace: "nowrap" },
      sort: true,
      headerFormatter: customHeaderFormatter,
      sortCaret: (order, column) => renderCustomSortIcon(order, column),
    },
    {
      dataField: "completionDate",
      text: "Completion Date",
      headerStyle: { whiteSpace: "nowrap" },
      style: { whiteSpace: "nowrap" },
      sort: true,
      headerFormatter: customHeaderFormatter,
      sortCaret: (order, column) => renderCustomSortIcon(order, column),
    },
    {
      dataField: "validityPeriod",
      text: "Validity Period",
      headerStyle: { whiteSpace: "nowrap" },
      style: { whiteSpace: "nowrap" },
      sort: true,
      headerFormatter: customHeaderFormatter,
      sortCaret: (order, column) => renderCustomSortIcon(order, column),
    },
    {
      dataField: "action",
      text: "Action",
      headerStyle: { textAlign: "center" },
      style: { textAlign: "center" },
      formatter: actionFormatter,
    },
  ];

  const handleRowSelect = (row, isSelect) => {
    if (isSelect) {
      setSelectedCertificateProfile([...selectedCertificateProfile, row]);
    } else {
      setSelectedCertificateProfile(
        selectedCertificateProfile.filter(
          (selectedRow) => selectedRow.id !== row.id
        )
      );
    }
  };

  const handleSelectAll = (isSelect, rows) => {
    if (isSelect) {
      setSelectedCertificateProfile(rows);
    } else {
      setSelectedCertificateProfile([]);
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
    selected: selectedCertificateProfile?.map((row) => row.id),
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
          selectedCertificateProfile?.some(
            (selectedRow) => selectedRow.id === row.id
          )
            ? commonStyle.selectedRow
            : commonStyle.tableRow
        }
      />
    </div>
  );
};

export default AssignedUserList;
