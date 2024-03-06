"use client";
import React, { useEffect, useState } from "react";
import { Row, Col } from "reactstrap";
import { GoSearch } from "react-icons/go";
import styles from "../../styles/commonStyles.module.css";
import ResetIcon from "@/assets/icons/resetIcon";
import { useRouter, useSearchParams } from "next/navigation";

const ManageFilter = () => {
  const searchParam = useSearchParams();
  const router = useRouter();
  const query = searchParam.get("search");
  const [onSearchChange, setOnSearchChange] = useState(query || "");

  useEffect(() => {
    setOnSearchChange(query || "");
  }, [query]);

  const submit = () => {
    onSearchChange
      ? router.replace(`/settings/positions?search=${onSearchChange}`)
      : reset();
  };

  const reset = () => {
    router.replace(`/settings/positions`);
  };

  return (
    <>
      <Row className={`d-flex align-items-center ${styles.filterWrapper}`}>
        <Col className={`lg="3" ${styles.searchWrapper}`}>
          <span className={styles.searchIcon}>
            <GoSearch color={"var(--searchIcon-color)"} />
          </span>
          <input
            value={onSearchChange}
            placeholder="Search by position"
            className={`${styles.searchInput}`}
            onChange={(e) => setOnSearchChange(e.target.value)}
            // onKeyDown={submit}
          />
        </Col>
        <Col className={`lg="3" text-start`}>
          <button type="button" className={styles.searchBtn} onClick={submit}>
            Search
          </button>
        </Col>
        <Col className={`lg="6" text-end`}>
          <div className={styles.resetBtn} onClick={reset}>
            <span>Reset</span>
            <ResetIcon />
          </div>
        </Col>
      </Row>
    </>
  );
};

export default ManageFilter;
