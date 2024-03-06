"use client";
import React, { useMemo, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import { BsEye } from "react-icons/bs";
import { MdCancel } from "react-icons/md";
import Image from "next/image";
import { API_URL } from "@/config";

import styles from "@/components/styles/commonStyles.module.css";
import tableStyle from "./checkpoints.module.css";
import modalStyle from "../style.module.css";
import useSiteStore from "@/store/siteStore";
import NoData from "@/components/noData/noData";
import RefreshIcon from "@/components/icons/refreshIcon";
import ActionHandlerModal from "@/components/modals/actionHandler";
import { renderCustomSortIcon } from "@/components/base/customSortIcon";

const UPLOAD_URL = `${API_URL}/api/upload-url/get-upload-urls`;

const CheckpointsLists = ({ siteName, checkpointsData }) => {
  const [QRCodeModal, setQRCodeModal] = useState(false);
  const [QRCodeUrl, setQRCodeUrl] = useState(null);

  const { QRProps, setQRProps } = useSiteStore((state) => ({
    QRProps: state.QRProps,
    setQRProps: state.setQRProps,
  }));

  const handleToggle = () => setQRCodeModal(!QRCodeModal);

  const renderQRProps = async (row) => {
    setQRCodeModal(true);
    setQRProps(row);
    
    const data = {
      urls: [row?.QRcode?.data?.attributes?.url],
    };
    const response = await fetch(UPLOAD_URL, {
      headers: {
        "Content-Type": "application/json",
        // "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
      body: JSON.stringify(data),
    });
    const json = await response.json();

    setQRCodeUrl(json?.data[0]);
  };

  const actionFormatter = (cell, row, rowIndex) => {
    return (
      <div
        onClick={() => renderQRProps(row)}
        className={tableStyle.titleContainer}
      >
        <BsEye
          size={24}
          color="var(--primary-blue)"
          className={styles.pointer}
        />
        <button type="button" className={styles.removeBtnProps}>
          <span
            className={`${tableStyle.blueText} ${styles.blueText} ${styles.pointer}`}
          >
            View QR Code
          </span>
        </button>
      </div>
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
      dataField: "Name",
      text: "Name",
      headerStyle: { width: "20%" },
      headerFormatter: customHeaderFormatter,
      sort: true,
      sortCaret: (order, column) => renderCustomSortIcon(order, column),
    },
    {
      dataField: "Location.Name",
      text: "Address",
      headerStyle: { width: "18%" },
      headerFormatter: customHeaderFormatter,
      sort: true,
      sortCaret: (order, column) => renderCustomSortIcon(order, column),
    },
    {
      dataField: "location",
      text: "Location",
      headerStyle: { width: "15%" },
      headerFormatter: customHeaderFormatter,
      sort: true,
      sortCaret: (order, column) => renderCustomSortIcon(order, column),
      formatter: (cell, row, rowIndex) => {
        const { Lat: lat, Long: long } = row?.Location;

        return (
          <div key={rowIndex} className={tableStyle.titleContainer}>
            {`(${lat}, ${long})`}
          </div>
        );
      },
    },
    {
      dataField: "action",
      text: "Action",
      headerStyle: { width: "10%", textAlign: "left" },
      style: { textAlign: "center" },
      formatter: actionFormatter,
    },
  ];

  return (
    <>
      <div className={styles.tableWrapper}>
        <BootstrapTable
          bootstrap4
          key={siteName}
          keyField="id"
          columns={columns}
          data={checkpointsData || []}
          bordered={false}
          selectRow={undefined}
        />
      </div>

      <ActionHandlerModal
        actionBtns={false}
        isOpen={QRCodeModal}
        toggle={handleToggle}
      >
        <div className={modalStyle.closeBtn}>
          <MdCancel
            color="var(--medium-gray)"
            onClick={handleToggle}
            style={{ width: "25px", height: "25px" }}
          />
        </div>
        <div className={modalStyle.header}>
          <div
            className={modalStyle.title}
          >{`${QRProps.locationName}, ${siteName}`}</div>
          <p className={modalStyle.subHeader}>
            Please Scan For Check In / Check Out
          </p>
        </div>

        <div
          className={`${
            QRProps?.code?.url
              ? tableStyle.bodyContainer
              : tableStyle.emptyContainer
          }`}
        >
          {QRCodeUrl && (
            <div className={modalStyle.refreshBtn}>
              <RefreshIcon />
            </div>
          )}

          {(QRCodeUrl && (
            <div className={modalStyle.header}>
              <Image
                src={QRCodeUrl}
                width={300}
                height={300}
                alt={QRProps.code?.name}
              />
            </div>
          )) || <NoData />}
        </div>
      </ActionHandlerModal>
    </>
  );
};

export default CheckpointsLists;
