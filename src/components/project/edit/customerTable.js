import React, { useEffect, useMemo, useState } from "react";
import commonStyle from "../../styles/commonStyles.module.css";
import BootstrapTable from "react-bootstrap-table-next";
import { useRouter } from "next/navigation";
import ActionMenu from "@/components/base/actionMenu";
import ViewAndEditCustomer from "./viewAndEditCustomer";

const CustomerTable = ({
  tableData,
  selectedCustomer,
  setSelectedCustomer,
  setCustomerForm,
  setDeleteModal,
}) => {
  const router = useRouter();
  const [tableKey, setTableKey] = useState(true);

  const [viewModal, setViewModal] = useState(false);
  const [customerID, setCustomerID] = useState("");

  useMemo(() => {
    setTableKey(!tableKey);
  }, [selectedCustomer]);

  const nameFormatter = (cell, row, rowIndex) => {
    return (
      <>
        <span
          className={commonStyle.pointer}
          onClick={() => {
            setCustomerID(row?.id);
            setViewModal(true);
          }}
        >
          {`${row?.firstName} ${row?.lastName}`}
        </span>
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
            setCustomerID(row?.id);
            setViewModal(true);
          }}
          deleteHandler={() => {
            setSelectedCustomer([row]);
            setDeleteModal(true);
          }}
        />
      </>
    );
  };

  const columns = [
    {
      dataField: "name",
      text: "Name",
      style: { whiteSpace: "nowrap", color: "#599CFF" },
      formatter: nameFormatter,
    },
    {
      dataField: "email",
      text: "Email",
    },
    {
      dataField: "contactNumber",
      text: "Contact No.",
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
      setSelectedCustomer([...selectedCustomer, row]);
    } else {
      setSelectedCustomer(
        selectedCustomer?.filter((selectedRow) => selectedRow.id !== row.id)
      );
    }
  };

  const handleSelectAll = (isSelect, rows) => {
    if (isSelect) {
      setSelectedCustomer(rows);
    } else {
      setSelectedCustomer([]);
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
    selected: selectedCustomer?.map((row) => row.id),
    onSelect: handleRowSelect,
    onSelectAll: handleSelectAll,
    selectionHeaderRenderer: selectionHeaderRenderer,
    selectionRenderer: selectionRenderer,
  };

  const viewToggle = () => {
    setCustomerID("");
    setViewModal(false);
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
          selectedCustomer?.some((selectedRow) => selectedRow.id === row.id)
            ? commonStyle.selectedRow
            : commonStyle.tableRow
        }
      />
      {viewModal && (
        <ViewAndEditCustomer
          isOpen={viewModal}
          toggle={viewToggle}
          customerID={customerID}
        />
      )}
    </div>
  );
};

export default CustomerTable;
