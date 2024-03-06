import React, { useMemo, useState } from "react";
import commonStyle from "../../styles/commonStyles.module.css";
import style from "@/components/project/project.module.css";
import BootstrapTable from "react-bootstrap-table-next";
import ActionMenu from "@/components/base/actionMenu";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getUniqueAssignedUsers } from "@/utils/helpers";
import { renderCustomSortIcon } from "@/components/base/customSortIcon";

const ManageProjectTable = ({
  tableData,
  setDeleteModal,
  selectedProjects,
  setSelectedProjects,
}) => {
  const router = useRouter();
  const [tableKey, setTableKey] = useState(true);
  const [expandDescription, setExpandDescription] = useState([]);

  // make text overflow
  const [isDescCollapse, setIsDescCollapse] = useState({});
  const toggleDescCollapse = (rowIndex) => {
    setIsDescCollapse((prev) => ({
      ...prev,
      [rowIndex]: !isDescCollapse[rowIndex],
    }));
  };

  useMemo(() => {
    setTableKey(!tableKey);
  }, [selectedProjects, expandDescription]);

  const actionFormatter = (cell, row, rowIndex) => {
    return (
      <>
        <ActionMenu
          viewAndEdit={true}
          deleteMenu={true}
          viewHandler={() => {
            router.push(`/settings/project/view/${row?.id}?tab=project`);
          }}
          deleteHandler={() => {
            setSelectedProjects([row]);
            setDeleteModal(true);
          }}
        />
      </>
    );
  };

  const descriptionFormatter = (cell, row, rowIndex, formatExtraData) => {
    // const onExpandHandler = () => {
    //   expandDescription.includes(row)
    //     ? setExpandDescription(
    //         expandDescription.filter((desc) => desc.id != row.id)
    //       )
    //     : setExpandDescription([...expandDescription, row]);
    // };

    // return (
    //   <>
    //     <div onClick={onExpandHandler} style={{ cursor: "pointer" }}>
    //       {expandDescription.includes(row)
    //         ? cell
    //         : cell?.length > 90
    //         ? cell?.substring(0, 90) + "..."
    //         : cell}
    //     </div>
    //   </>
    // );

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
            ? style.descCollapse
            : style.descNotCollapse
        }
        onClick={() => toggleDescCollapse(rowIndex)}
      >
        <span>{cell}</span>
      </div>
    );
  };

  const customHeaderFormatter = (column, colIndex, components) => {
    return (
      <div className="d-flex align-items-center gap-1">
        {column.text}
        <div className="p-0">{components.sortElement}</div>
      </div>
    );
  };

  const columns = [
    {
      dataField: "name",
      text: "Project Name",
      // headerStyle: { maxWidth: 200 },
      style: { color: "#599CFF" },
      headerFormatter: customHeaderFormatter,
      sort: true,
      sortCaret: (order, column) => renderCustomSortIcon(order, column),
      formatter: (cell, row) => {
        return (
          <Link
            href={{
              pathname: `/settings/project/view/${row?.id}`,
              query: { tab: "project" },
            }}
          >
            {cell}
          </Link>
        );
      },
    },
    {
      dataField: "description",
      text: "Description",
      headerStyle: { minWidth: 200, maxWidth: 400 },
      style: { minWidth: 200, maxWidth: 400 },
      headerFormatter: customHeaderFormatter,
      sort: true,
      sortCaret: (order, column) => renderCustomSortIcon(order, column),
      formatExtraData: {
        isDescCollapse,
        setIsDescCollapse,
      },
      formatter: descriptionFormatter,
    },
    {
      dataField: "customers",
      text: "Customer",
      headerStyle: { width: "10%" },
      style: { color: "#599CFF" },
      headerFormatter: customHeaderFormatter,
      sort: true,
      sortCaret: (order, column) => renderCustomSortIcon(order, column),
      formatter: (cell, row) => {
        return (
          <Link href={`/settings/project/view/${row?.id}?tab=customer`}>
            {cell?.length}
          </Link>
        );
      },
    },
    {
      dataField: "profiles",
      text: "Participants",
      headerStyle: { width: "10%" },
      style: { color: "#599CFF" },
      headerFormatter: customHeaderFormatter,
      sort: true,
      sortCaret: (order, column) => renderCustomSortIcon(order, column),
      formatter: (cell, row) => {
        return (
          <Link href={`/settings/project/view/${row?.id}?tab=participants`}>
            {cell?.length}
          </Link>
        );
      },
    },
    {
      dataField: "action",
      text: "Action",
      formatter: actionFormatter,
    },
  ];

  const handleRowSelect = (row, isSelect) => {
    if (isSelect) {
      setSelectedProjects([...selectedProjects, row]);
    } else {
      setSelectedProjects(
        selectedProjects.filter((selectedRow) => selectedRow.id !== row.id)
      );
    }
  };

  const handleSelectAll = (isSelect, rows) => {
    if (isSelect) {
      setSelectedProjects(rows);
    } else {
      setSelectedProjects([]);
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
    selected: selectedProjects.map((row) => row.id),
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
          selectedProjects.some((selectedRow) => selectedRow.id === row.id)
            ? commonStyle.selectedRow
            : commonStyle.tableRow
        }
      />
    </div>
  );
};

export default ManageProjectTable;
