"use client";
import React from "react";
import { Row, Col } from "reactstrap";
import { GoSearch } from "react-icons/go";
import styles from "../../styles/commonStyles.module.css";
import ResetIcon from "@/assets/icons/resetIcon";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import SelectBox from "@/components/selectBox";

const options = [
  { value: 1, label: "one" },
  { value: 2, label: "two" },
];

const CertificationsFilter = () => {
  const router = useRouter();

  const { control, handleSubmit, register, reset, setValue } = useForm();

  const submit = (data) => {
    let query = "";
    if (data.name) {
      query += `name=${data.name}&`;
    }
    if (data.providedBy) {
      query += `providedBy=${data.providedBy}&`;
    }
    if (data.location) {
      query += `traininglocation=${data.location}&`;
    }
    router.replace(`/settings/certifications?${query.slice(0, -1)}`);
  };

  const clearParams = () => {
    router.replace(`/settings/certifications`);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(submit)}>
      <Row className={`d-flex align-items-center ${styles.filterWrapper}`}>
        <Col className={`mb="6" ${styles.searchWrapper}`} lg={3}>
          <span className={styles.searchIcon}>
            <GoSearch color={"var(--searchIcon-color)"} />
          </span>
          <input
            placeholder="Search by Certification"
            className={`${styles.searchInput}`}
            {...register("name")}
          />
        </Col>
        <Col className={`mb="6" ${styles.searchWrapper}`} lg={2}>
          <input
            placeholder="Provided by"
            {...register("providedBy")}
            className={`${styles.searchInputWithoutIcon}`}
          />
        </Col>
        <Col className={`mb="6" ${styles.searchWrapper}`} lg={2}>
          <input
            placeholder="Training Location"
            {...register("location")}
            className={`${styles.searchInputWithoutIcon}`}
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

export default CertificationsFilter;
