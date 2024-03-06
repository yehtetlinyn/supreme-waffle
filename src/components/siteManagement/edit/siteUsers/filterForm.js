import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { GoSearch } from "react-icons/go";
import { Col, Row } from "reactstrap";

import styles from "@/components/styles/commonStyles.module.css";
import ResetIcon from "@/assets/icons/resetIcon";
const UsersFilterForm = () => {
  const { handleSubmit, register, control, reset } = useForm();
  const router = useRouter();
  const pathname = usePathname();

  const searchHandler = (data) => {
    router.push(`${pathname}?tab=users&username=${data.username}`);
  };

  const resetHandler = () => {
    router.replace(`${pathname}?tab=users`);
    reset();
  };
  return (
    <>
      <form onSubmit={handleSubmit(searchHandler)} className="w-50">
        <Row className={`d-flex align-items-center ${styles.filterWrapper}`}>
          <Col className={`lg="3" ${styles.searchWrapper}`}>
            <span className={styles.searchIcon}>
              <GoSearch color={"var(--searchIcon-color)"} />
            </span>
            <input
              type="text"
              placeholder="Search by Username"
              className={`${styles.searchInput}`}
              {...register("username")}
            />
          </Col>
          <Col className={`text-start d-flex align-items-center`}>
            <button type="submit" className={styles.formCreateBtn}>
              Search
            </button>
            <div className={`${styles.resetBtn} ms-3`} onClick={resetHandler}>
              <span>Reset</span>
              <ResetIcon />
            </div>
          </Col>
        </Row>
      </form>
    </>
  );
};

export default UsersFilterForm;
