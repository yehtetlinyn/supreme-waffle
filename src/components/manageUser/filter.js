"use client";
import React from "react";
import { Row, Col } from "reactstrap";
import { GoSearch } from "react-icons/go";
import styles from "../styles/commonStyles.module.css";
import ResetIcon from "@/assets/icons/resetIcon";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

const ManageUserFilter = () => {
  const router = useRouter();

  const { handleSubmit, register, reset, setValue } = useForm();

  const submit = (data) => {
    setValue("name", data.name);
    let query = "";
    if (data.name) {
      query += `name=${data.name}&`;
    }
    router.replace(`/settings/manageUsers?${query.slice(0, -1)}`);
  };

  const clearParams = () => {
    router.replace(`/settings/manageUsers`);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(submit)}>
      <Row className={`d-flex align-items-center ${styles.filterWrapper}`}>
        <Col className={`mb="6" ${styles.searchWrapper}`} lg={4}>
          <span className={styles.searchIcon}>
            <GoSearch color={"var(--searchIcon-color)"} />
          </span>
          <input
            placeholder="Search by user name"
            className={`${styles.searchInput}`}
            {...register("name")}
          />
        </Col>
        <Col className={`lg="3" text-start`}>
          <button type="submit" className={styles.searchBtn}>
            Search
          </button>
        </Col>
        <Col className={`lg="6" text-end`}>
          <div className={styles.resetBtn} onClick={clearParams}>
            <span>Reset</span>
            <ResetIcon />
          </div>
        </Col>
      </Row>
    </form>
  );
};

export default ManageUserFilter;
