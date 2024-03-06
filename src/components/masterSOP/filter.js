"use client";
import React, { useEffect, useState } from "react";
import { Row, Col } from "reactstrap";
import { GoSearch } from "react-icons/go";
import { usePathname, useRouter } from "next/navigation";

import styles from "../styles/commonStyles.module.css";
import ResetIcon from "@/assets/icons/resetIcon";

import { priorityOptions } from "@/utils/data";
import { useForm, Controller } from "react-hook-form";
import SelectBox from "@/components/selectBox/index";
import useIncidentTypeStore from "@/store/incidentTypeStore";
import { shallow } from "zustand/shallow";

const FilterForm = ({ siteSOPForm = false, pathname = "" }) => {
  const router = useRouter();
  const masterSopPathname = usePathname();

  const { control, handleSubmit, register, reset, getValues } = useForm();

  const {
    fetchIncidentType,
    incidentTypeData,
    loading: incidentTypeLoading,
  } = useIncidentTypeStore(
    (state) => ({
      fetchIncidentType: state.fetchIncidentType,
      incidentTypeData: state.incidentTypeData,
      loading: state.loading,
    }),
    shallow
  );

  const incidentTypeOptions = incidentTypeData?.map((data) => {
    return {
      value: data?.id,
      label: data?.attributes?.name,
    };
  });

  //search function
  const searchHandler = (data) => {
    let query = siteSOPForm ? "tab=sop&" : "";
    if (data.title) {
      query += `sopName=${data.title}&`;
    }
    if (data.incidentType) {
      query += `incidentType=${data.incidentType.value}&`;
    }
    if (data.priority) {
      query += `priority=${data.priority.label}&`;
    }
    router.push(
      siteSOPForm
        ? `${pathname}?${query.slice(0, -1)}`
        : `masterSOP/?${query.slice(0, -1)}`
    );
  };

  //for clear search input value
  const resetHandler = () => {
    router.replace(siteSOPForm ? `${pathname}?tab=sop` : masterSopPathname);
    reset();
  };

  useEffect(() => {
    fetchIncidentType();
  }, []);
  return (
    <>
      <form onSubmit={handleSubmit(searchHandler)}>
        <Row className={`d-flex align-items-center ${styles.filterWrapper}`}>
          <Col className={`lg="3" ${styles.searchWrapper}`}>
            <span className={styles.searchIcon}>
              <GoSearch color={"var(--searchIcon-color)"} />
            </span>
            <input
              placeholder="Search by Title"
              className={`${styles.searchInput}`}
              {...register("title")}
            />
          </Col>
          <Col lg="2">
            <Controller
              name="incidentType"
              control={control}
              render={({ field: { onChange, name, value } }) => {
                return (
                  <SelectBox
                    placeholder="Incident Type"
                    options={incidentTypeOptions}
                    onChange={onChange}
                    value={value}
                    filterForm
                    instanceId={"incidentType"}
                    sop
                  />
                );
              }}
            />
          </Col>
          <Col lg="2">
            <Controller
              name="priority"
              control={control}
              render={({ field: { onChange, name, value } }) => (
                <SelectBox
                  placeholder="Priority"
                  options={priorityOptions}
                  onChange={onChange}
                  value={value}
                  filterForm
                  instanceId={"priority"}
                  sop
                />
              )}
            />
          </Col>
          <Col className={`text-start`}>
            <button type="submit" className={styles.formCreateBtn}>
              Search
            </button>
          </Col>
          <Col className={`text-end`}>
            <div className={styles.resetBtn} onClick={resetHandler}>
              <span>Reset</span>
              <ResetIcon />
            </div>
          </Col>
        </Row>
      </form>
    </>
  );
};

export default FilterForm;
