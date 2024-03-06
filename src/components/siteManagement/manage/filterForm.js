"use client";
import React, { useState } from "react";
import { Row, Col } from "reactstrap";
import { GoSearch } from "react-icons/go";

import styles from "@/components/styles/commonStyles.module.css";
import ResetIcon from "@/assets/icons/resetIcon";
import { usePathname, useRouter } from "next/navigation";

const FilterForm = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [searchValue, setSearchValue] = useState("");

  const searchHandler = () => {
    router.replace(`${pathname}?search=${searchValue}`);
  };

  const resetHandler = () => {
    router.replace(pathname);
    setSearchValue("");
  };
  return (
    <>
      <Row className={`d-flex align-items-center ${styles.filterWrapper}`}>
        <Col className={`lg="3" ${styles.searchWrapper}`}>
          <span className={styles.searchIcon}>
            <GoSearch color={"var(--searchIcon-color)"} />
          </span>
          <input
            value={searchValue}
            placeholder="Search by name"
            className={`${styles.searchInput}`}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </Col>
        <Col className={`lg="3" text-start`}>
          <button
            type="button"
            className={styles.formCreateBtn}
            onClick={searchHandler}
          >
            Search
          </button>
        </Col>
        <Col className={`lg="6" text-end`}>
          <div className={styles.resetBtn} onClick={resetHandler}>
            <span>Reset</span>
            <ResetIcon />
          </div>
        </Col>
      </Row>
    </>
  );
};

export default FilterForm;
