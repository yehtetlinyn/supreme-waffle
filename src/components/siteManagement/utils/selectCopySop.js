import React, { useState, useCallback } from "react";
import { BsEye } from "react-icons/bs";
import { shallow } from "zustand/shallow";

import BootstrapTable from "react-bootstrap-table-next";

import useMasterSOPStore from "@/store/masterSOPStore";
import commonStyles from "@/components/styles/commonStyles.module.css";
import styles from "@/components/siteManagement/site.module.css";
import useSiteSopStore from "@/store/siteSopStore";
import PreviewSopModal from "@/components/siteManagement/utils/previewSopModal";

const SelectCopySop = () => {
  const masterSOPData = useMasterSOPStore((state) => state.masterSOPData);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const toggleIsPreviewOpen = useCallback(() => {
    setIsPreviewOpen(!isPreviewOpen);
  }, [isPreviewOpen]);

  const { copyMasterSopData, setCopyMasterSopData } = useSiteSopStore(
    (state) => ({
      copyMasterSopData: state.copyMasterSopData,
      setCopyMasterSopData: state.setCopyMasterSopData,
    }),
    shallow
  );

  const columns = [
    {
      dataField: "name",
      text: "SOP Name",
    },
    {
      dataField: "incident.data.attributes.name",
      text: "Incident Type",
    },
    { dataField: "impact", text: "Impact" },
    {
      dataField: "priority",
      text: "Priority",
      formatter: (cell) => {
        return (
          <span
            style={{
              color:
                cell === "High" || cell === "Urgent"
                  ? "var(--text-red)"
                  : cell === "Medium"
                  ? "var(--text-orange)"
                  : cell === "Low"
                  ? "var(--primary-yellow)"
                  : "",
            }}
          >
            {cell}
          </span>
        );
      },
    },
    {
      dataField: "",
      text: "Preview",
      headerStyle: { textAlign: "center" },
      style: { textAlign: "center" },
      formatter: (cell, row) => {
        return (
          <span
            className={commonStyles.blueText}
            onClick={() => {
              toggleIsPreviewOpen();
              setCopyMasterSopData(row);
            }}
          >
            <BsEye size={24} />
          </span>
        );
      },
    },
  ];

  const selectionRenderer = ({ mode, checked, onChange }) => (
    <div>
      <input
        type="radio"
        onChange={() => onChange}
        checked={checked}
        className={commonStyles.tableRadioBtn}
        id="radio-button"
      />
    </div>
  );

  const selectedRow = {
    mode: "radio",
    clickToSelect: true, // click row to select
    classes: styles.selectedRow, // to add styles for selected row
    selected: [copyMasterSopData?.id],

    onSelect: (row, isSelect, rowIndex, e) => {
      if (isSelect) {
        setCopyMasterSopData(row);
      }
    },
    selectionRenderer: selectionRenderer,
  };

  return (
    <>
      {isPreviewOpen && (
        <PreviewSopModal isOpen={isPreviewOpen} toggle={toggleIsPreviewOpen} />
      )}

      <div className={commonStyles.tableWrapper}>
        <BootstrapTable
          bootstrap4
          keyField="id"
          data={masterSOPData || []}
          columns={columns}
          selectRow={selectedRow}
          bordered={false}
          rowClasses={styles.hoverableRow}
        />
      </div>
    </>
  );
};

export default SelectCopySop;
