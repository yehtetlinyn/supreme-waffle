import React, { useMemo, useState } from "react";
import commonStyles from "../styles/commonStyles.module.css";
import styles from "./manageUser.module.css";
import SelectUsersTable from "./selectUsersTable";
import Paginate from "../pagination/page";
import Loading from "../modals/loading";
import { useRouter } from "next/navigation";

const pageSize = 10;

const SelectUser = ({
  setCurrentTab,
  uploadedUsers,
  setSelectedUsers,
  selectedUsers,
}) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedUsers, setPaginatedUsers] = useState([]);

  useMemo(() => {
    if (uploadedUsers?.length > 0) {
      const firstPageIndex = (currentPage - 1) * pageSize;
      const lastPageIndex = firstPageIndex + pageSize;
      const data = uploadedUsers.slice(firstPageIndex, lastPageIndex);

      setPaginatedUsers(data);
    }
  }, [currentPage, uploadedUsers]);

  if (uploadedUsers) {
    return (
      <div className={styles.selectUsersContainer}>
        <div className={styles.infoText}>
          {selectedUsers.length + " "}
          <span>Users Selected</span>
        </div>
        <div style={{ overflow: "auto" }}>
          <SelectUsersTable
            tableData={paginatedUsers}
            selectedUsers={selectedUsers}
            setSelectedUsers={setSelectedUsers}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "auto",
          }}
        >
          <div className={styles.paginateText}>
            <span>Displaying</span>
            {" " + paginatedUsers?.length + " "}
            <span>of</span>
            {" " + uploadedUsers?.length + " "}
            <span>Users</span>
          </div>
          <Paginate
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            pageCount={uploadedUsers?.length / 10}
          />
        </div>

        <div className={styles.actionButtonContainer} style={{ margin: 0 }}>
          <button
            className={commonStyles.formCancelBtn}
            onClick={() => router.push("/settings/manageUsers")}
          >
            Cancel
          </button>
          <button
            className={
              selectedUsers.length > 0
                ? commonStyles.browseBtn
                : commonStyles.disabledBtn
            }
            style={{ marginLeft: "auto" }}
            disabled={selectedUsers.length <= 0}
            onClick={() => setCurrentTab(3)}
          >
            Next
          </button>
        </div>
      </div>
    );
  } else {
    return <Loading />;
  }
};

export default SelectUser;
