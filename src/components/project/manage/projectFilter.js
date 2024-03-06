"use client";
import React, { useEffect, useState } from "react";
import { Row, Col } from "reactstrap";
import { GoSearch } from "react-icons/go";
import styles from "../../styles/commonStyles.module.css";
import ResetIcon from "@/assets/icons/resetIcon";
import { useRouter, useSearchParams } from "next/navigation";

const ProjectFilter = ({ reset }) => {
  const searchParam = useSearchParams();
  const router = useRouter();
  const query = searchParam.get("name");
  const [onSearchChange, setOnSearchChange] = useState(query || "");

  useEffect(() => {
    setOnSearchChange(query || "");
  }, [query]);

  const submit = () => {
    onSearchChange
      ? router.replace(`/settings/project?name=${onSearchChange}`)
      : resetHandler();
  };

  const resetHandler = () => {
    router.replace(`/settings/project`);
  };

  return (
    <>
      <Row className={`d-flex align-items-center ${styles.filterWrapper}`}>
        <Col className={`mb="6" ${styles.searchWrapper}`} lg={4}>
          <span className={styles.searchIcon}>
            <GoSearch color={"var(--searchIcon-color)"} />
          </span>
          <input
            value={onSearchChange}
            placeholder="Search by name"
            className={`${styles.searchInput}`}
            onChange={(e) => setOnSearchChange(e.target.value)}
          />
        </Col>
        <Col className={`lg="3" text-start`}>
          <button type="button" className={styles.searchBtn} onClick={submit}>
            Search
          </button>
        </Col>
        {reset && (
          <Col className={`lg="6" text-end`}>
            <div className={styles.resetBtn} onClick={resetHandler}>
              <span>Reset</span>
              <ResetIcon />
            </div>
          </Col>
        )}
      </Row>
    </>
  );
};

export default ProjectFilter;
