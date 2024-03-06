"use client";
import React, { useEffect, useState } from "react";
import { Row, Col } from "reactstrap";
import { GoSearch } from "react-icons/go";
import styles from "../../styles/commonStyles.module.css";
import ResetIcon from "@/assets/icons/resetIcon";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { PrimaryBtn } from "@/components/base/primaryBtn";
import { AiOutlinePlus } from "react-icons/ai";

const TabContentFilter = ({ createBtn, createText, handleCreate, reset }) => {
  const searchParam = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const tabName = searchParam.get("tab");
  const name = searchParam.get("name");
  const [onSearchChange, setOnSearchChange] = useState(name || "");

  useEffect(() => {
    setOnSearchChange(name || "");
  }, [name]);

  const submit = () => {
    onSearchChange
      ? router.replace(`${pathname}?tab=${tabName}&name=${onSearchChange}`)
      : resetHandler();
  };

  const resetHandler = () => {
    router.replace(`${pathname}/?tab=${tabName}`);
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
            <div
              className={styles.resetBtn}
              onClick={resetHandler}
              style={{ padding: 0 }}
            >
              <span>Reset</span>
              <ResetIcon />
            </div>
          </Col>
        )}
        {createBtn && (
          <Col className={`lg="6" text-end`}>
            <button
              id="addButton"
              type="button"
              style={{ marginLeft: "auto" }}
              className={styles.addBtn}
              onClick={handleCreate}
            >
              <AiOutlinePlus />
              {createText}
            </button>
          </Col>
        )}
      </Row>
    </>
  );
};

export default TabContentFilter;
