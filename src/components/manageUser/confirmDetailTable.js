import React, { useMemo, useState } from "react";
import commonStyle from "../styles/commonStyles.module.css";
import BootstrapTable from "react-bootstrap-table-next";
import Image from "next/image";

const ConfirmDetailTable = ({ tableData }) => {
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
  ];

  return (
    <div className={commonStyle.tableWrapper}>
      <BootstrapTable
        bootstrap4
        keyField="id"
        bordered={false}
        columns={columns}
        data={tableData}
      />
    </div>
  );
};

export default ConfirmDetailTable;
