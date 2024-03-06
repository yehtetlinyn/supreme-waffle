import React, { useMemo, useState } from "react";
import commonStyles from "../styles/commonStyles.module.css";
import styles from "./manageUser.module.css";
import useUsersStore from "@/store/user";
import Paginate from "../pagination/page";
import ConfirmDetailTable from "./confirmDetailTable";
import { useRouter } from "next/navigation";

const pageSize = 10;

const ConfirmDetail = ({ setCurrentTab, selectedUsers, submit }) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedUsers, setPaginatedUsers] = useState([]);

  useMemo(() => {
    if (selectedUsers?.length > 0) {
      const firstPageIndex = (currentPage - 1) * pageSize;
      const lastPageIndex = firstPageIndex + pageSize;
      const data = selectedUsers?.slice(firstPageIndex, lastPageIndex);

      setPaginatedUsers(data);
    }
  }, [currentPage, selectedUsers]);

  return (
    <div className={styles.selectUsersContainer}>
      <div style={{ overflow: "auto" }}>
        <ConfirmDetailTable tableData={paginatedUsers} />
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
          {" " + selectedUsers?.length + " "}
          <span>Users</span>
        </div>
        <Paginate
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          pageCount={selectedUsers?.length / 10}
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
          className={commonStyles.formCreateBtn}
          style={{ marginLeft: "auto" }}
          onClick={() => setCurrentTab(2)}
        >
          Back
        </button>
        <button
          className={commonStyles.formCreateBtn}
          onClick={() => submit("importUsers")}
        >
          Create
        </button>
      </div>
    </div>
  );
};

export default ConfirmDetail;
