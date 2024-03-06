import React, { useMemo, useState } from "react";
import commonStyle from "../../styles/commonStyles.module.css";
import BootstrapTable from "react-bootstrap-table-next";
import ActionMenu from "@/components/base/actionMenu";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getUniqueAssignedUsers } from "@/utils/helpers";
import { renderCustomSortIcon } from "@/components/base/customSortIcon";

const CertificationList = ({
  tableData,
  setDeleteModal,
  selectedCertificates,
  setSelectedCertificates,
}) => {
  const router = useRouter();
  const [tableKey, setTableKey] = useState(true);
  const [expandDescription, setExpandDescription] = useState([]);

  useMemo(() => {
    setTableKey(!tableKey);
  }, [selectedCertificates, expandDescription]);

  const actionFormatter = (cell, row, rowIndex) => {
    return (
      <>
        <ActionMenu
          viewAndEdit={true}
          deleteMenu={true}
          viewHandler={() => {
            router.push(`/settings/certifications/view/${row?.id}`);
          }}
          deleteHandler={() => {
            setSelectedCertificates([row]);
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
        <div onClick={onExpandHandler} style={{ cursor: "pointer" }}>
          {expandDescription.includes(row)
            ? cell
            : cell?.length > 90
            ? cell?.substring(0, 90) + "..."
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

  const columns = [
    {
      dataField: "logo",
      text: "Icon",
      formatter: (cell, row) => {
        return (
          <Image
            src={cell.url}
            alt="certification-icon"
            width={25}
            height={25}
          />
        );
      },
    },
    {
      dataField: "name",
      text: "Certification",
      headerStyle: { whiteSpace: "nowrap" },
      style: { whiteSpace: "nowrap", color: "#599CFF" },
      headerFormatter: customHeaderFormatter,
      sort: true,
      sortCaret: (order, column) => renderCustomSortIcon(order, column),
      formatter: (cell, row) => {
        return (
          <Link href={`/settings/certifications/view/${row?.id}`}>{cell}</Link>
        );
      },
    },
    {
      dataField: "providerName",
      text: "Provided by",
      headerStyle: { whiteSpace: "nowrap" },
      style: { whiteSpace: "nowrap" },
      headerFormatter: customHeaderFormatter,
      sort: true,
      sortCaret: (order, column) => renderCustomSortIcon(order, column),
    },
    {
      dataField: "certificateProfiles",
      text: "No of People",
      headerStyle: { whiteSpace: "nowrap" },
      style: { textAlign: "center", color: "#599CFF" },
      headerFormatter: customHeaderFormatter,
      sort: true,
      sortCaret: (order, column) => renderCustomSortIcon(order, column),
      formatter: (cell, row) => {
        return (
          <Link href={`/settings/certifications/view/${row?.id}/assignuser`}>
            {getUniqueAssignedUsers(cell).length}
          </Link>
        );
      },
    },
    {
      dataField: "duration",
      text: "Duration",
      headerStyle: { whiteSpace: "nowrap" },
      style: { whiteSpace: "nowrap" },
      headerFormatter: customHeaderFormatter,
      sort: true,
      sortCaret: (order, column) => renderCustomSortIcon(order, column),
    },
    {
      dataField: "action",
      text: "Action",
      headerStyle: { whiteSpace: "nowrap" },
      style: { whiteSpace: "nowrap", textAlign: "center" },
      formatter: actionFormatter,
    },
    {
      dataField: "trainingLocation",
      text: "Training Location",
      headerStyle: { whiteSpace: "nowrap" },
      style: { whiteSpace: "nowrap" },
      headerFormatter: customHeaderFormatter,
      sort: true,
      sortCaret: (order, column) => renderCustomSortIcon(order, column),
    },
    {
      dataField: "description",
      text: "Description",
      headerStyle: { whiteSpace: "nowrap" },
      style: { minWidth: "400px" },
      headerFormatter: customHeaderFormatter,
      sort: true,
      sortCaret: (order, column) => renderCustomSortIcon(order, column),
      formatter: descriptionFormatter,
    },
  ];

  const handleRowSelect = (row, isSelect) => {
    if (isSelect) {
      setSelectedCertificates([...selectedCertificates, row]);
    } else {
      setSelectedCertificates(
        selectedCertificates.filter((selectedRow) => selectedRow.id !== row.id)
      );
    }
  };

  const handleSelectAll = (isSelect, rows) => {
    if (isSelect) {
      setSelectedCertificates(rows);
    } else {
      setSelectedCertificates([]);
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
    selected: selectedCertificates.map((row) => row.id),
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
          selectedCertificates.some((selectedRow) => selectedRow.id === row.id)
            ? commonStyle.selectedRow
            : commonStyle.tableRow
        }
      />
    </div>
  );
};

export default CertificationList;
