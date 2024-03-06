import React, { useMemo, useState } from "react";
import commonStyles from "@/components/styles/commonStyles.module.css";
import BootstrapTable from "react-bootstrap-table-next";
import useSiteUserStore from "@/store/siteUserStore";
import styles from "@/components/styles/commonStyles.module.css";
import ActionMenu from "@/components/base/actionMenu";
import dayjs from "dayjs";
import { shallow } from "zustand/shallow";
import DeleteConfirmation from "@/components/modals/delete";
import { useMutation } from "@apollo/client";
import { REMOVE_ASSIGN_USERS_FROM_SITE } from "@/graphql/mutations/siteUser";
import apolloClient from "@/lib/apolloClient";
import Image from "next/image";

const SiteUsersTable = ({
  currentPage,
  setCurrentPage,
  selectedRows,
  setSelectedRows,
  selectedUserData,
  setSelectedUserData,
  toggleViewUserPage,
  isDeleteModalOpen,
  toggleDeleteModalOpen,
}) => {
  const { siteUsersData, handleRefresh } = useSiteUserStore(
    (state) => ({
      siteUsersData: state.siteUsersData,
      handleRefresh: state.handleRefresh,
    }),
    shallow
  );
  const [hoveredRow, setHoveredRow] = useState(null);
  const [tableKey, setTableKey] = useState(true);

  const removeConfirmationModalHandler = (data) => {
    toggleDeleteModalOpen();
    setSelectedUserData([
      {
        id: data?.id,
        name: data?.fullName,
        siteName: data?.sites?.data[0]?.attributes?.name,
      },
    ]);
  };
  useMemo(() => {
    setTableKey(!tableKey);
  }, [selectedRows, hoveredRow]);

  const actionFormatter = (cell, row, rowIndex) => {
    return (
      <>
        <ActionMenu
          siteUser
          view={true}
          deleteMenu={true}
          deleteHandler={() => removeConfirmationModalHandler(row)}
          viewHandler={() => {
            toggleViewUserPage();
            setSelectedUserData(row);
          }}
          id={row.id}
        />
      </>
    );
  };

  const profileFormatter = (cell, row) => {
    return (
      <div
        className="d-flex align-items-center"
        onClick={() => {
          toggleViewUserPage();
          setSelectedUserData(row);
        }}
      >
        <div className={commonStyles.tableImageContainer}>
          {row?.photo?.data?.attributes.url ? (
            <Image
              src={`${row?.photo?.data?.attributes.url}`}
              alt="Image"
              width={40}
              height={40}
              className={commonStyles.image}
            />
          ) : (
            <>
              <Image
                src="/images/blank-profile-picture-geede3862d_1280.png"
                alt="no"
                width={40}
                height={40}
                className={commonStyles.image}
              />
            </>
          )}
        </div>
        <span className={`${commonStyles.blueText} ${commonStyles.pointer}`}>
          {cell}
        </span>
      </div>
    );
  };
  const columns = [
    {
      dataField: "fullName",
      text: "Name",
      formatter: profileFormatter,
    },
    {
      dataField: "email",
      text: "Email",
    },
    {
      dataField: "joinedDate",
      text: "Join Date",
      formatter: (cell, row) => {
        return (
          <>
            <span>{dayjs(cell).format("D MMM YYYY")}</span>
          </>
        );
      },
    },
    { dataField: "position.attributes.name", text: "Position" },

    {
      dataField: "",
      text: "Action",
      headerStyle: { textAlign: "center" },
      style: { textAlign: "center" },
      formatter: actionFormatter,
    },
  ];

  const handleRowSelect = (row, isSelect) => {
    if (isSelect) {
      setSelectedRows([...selectedRows, row]);
    } else {
      setSelectedRows(
        selectedRows.filter((selectedRow) => selectedRow.id !== row.id)
      );
    }
  };

  const handleSelectAll = (isSelect, rows) => {
    if (isSelect) {
      setSelectedRows(rows);
    } else {
      setSelectedRows([]);
    }
  };

  const CustomCheckbox = ({ checked, onChange }) => (
    <div className={styles.tableCheckBox}>
      <input type="checkbox" checked={checked} onChange={onChange} />
    </div>
  );

  const selectionHeaderRenderer = ({ mode, checked, indeterminate }) => (
    <CustomCheckbox
      checked={checked}
      onChange={() => handleSelectAll(!checked, siteUsersData)}
    />
  );

  const selectionRenderer = ({ mode, checked, onChange }) => (
    <CustomCheckbox checked={checked} onChange={() => {}} />
  );

  const selectRow = {
    mode: "checkbox",
    selected: selectedRows.map((row) => row.id),
    onSelect: handleRowSelect,
    onSelectAll: handleSelectAll,
    selectionHeaderRenderer: selectionHeaderRenderer,
    selectionRenderer: selectionRenderer,
  };

  const [removeAssignedUserAction, { loading, error }] = useMutation(
    REMOVE_ASSIGN_USERS_FROM_SITE,
    {
      client: apolloClient,
      onCompleted: (data) => {
        console.log("successfully remove user");
      },
      onError: (error) => {
        console.log("error", error);
      },
    }
  );

  const removeAssignedUser = async () => {
    for (let userData of selectedUserData) {
      await removeAssignedUserAction({
        variables: {
          profileId: userData?.id,
        },
      });
      if (error) break;
    }
    handleRefresh();
    toggleDeleteModalOpen();
    setSelectedUserData([]);
    setSelectedRows([]);
  };

  return (
    <>
      <div className={commonStyles.tableWrapper}>
        <BootstrapTable
          bootstrap4
          key={tableKey}
          keyField="id"
          columns={columns}
          data={siteUsersData || []}
          bordered={false}
          selectRow={selectRow}
          rowClasses={(row, rowIndex) =>
            selectedRows?.some((selectedRow) => selectedRow.id === row.id)
              ? styles.selectedRow
              : styles.tableRow
          }
        />
      </div>
      {isDeleteModalOpen && (
        <DeleteConfirmation
          isOpen={isDeleteModalOpen}
          toggle={toggleDeleteModalOpen}
          selectedRow={selectedUserData}
          deleteHandler={removeAssignedUser}
          loading={loading}
          siteUser
          totalRows={selectedUserData?.length}
        />
      )}
    </>
  );
};

export default SiteUsersTable;
