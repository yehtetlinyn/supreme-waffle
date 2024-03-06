import { Controller, useForm } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import { FiExternalLink } from "react-icons/fi";
import { GoSearch } from "react-icons/go";

import ResetIcon from "@/assets/icons/resetIcon";
import CalendarIcon from "@/components/icons/calendarIcon";
import SelectBox from "@/components/selectBox";
import styles from "@/components/styles/commonStyles.module.css";
import shiftStyle from "../style.module.css";

const AttendanceHistoryHeader = () => {
  const router = useRouter();
  const params = useParams();
  const { control, reset } = useForm();

  const clearParams = () => {
    router.replace(`/siteOperations/site/view/${params?.id}`);
    reset();
  };

  return (
    <>
      <section className={`p-0 ${shiftStyle.optionContent}`}>
        <div className={shiftStyle.optionHeader}>
          <div className={shiftStyle.optionColumn}>
            <Controller
              name="shiftType"
              control={control}
              render={({ field: { onChange, name, value } }) => {
                return (
                  <SelectBox
                    inputForm
                    defaultSelector
                    placeholder="Select Location"
                    options={[]}
                    onChange={onChange}
                    value={value}
                    instanceId={"location"}
                  />
                );
              }}
            />
          </div>
          <div className={shiftStyle.optionColumn}>
            <button
              className={`${shiftStyle.actionBtn} ${styles.removeBtnProps}`}
              onClick={() => {}}
            >
              Export Excel
              <FiExternalLink size={20} />
            </button>
          </div>
        </div>
      </section>

      <section className={`p-0 ${shiftStyle.optionContainer}`}>
        <div className="d-flex mb-4 flex-wrap align-items-start justify-content-start">
          <div className={`me-3 ${styles.searchWrapper}`}>
            <span className={styles.searchIcon}>
              <GoSearch color={"var(--searchIcon-color)"} />
            </span>
            <input
              value={""}
              placeholder="Search by name"
              className={`${styles.searchInput}`}
              onChange={() => {}}
              onKeyDown={() => {}}
            />
          </div>
          <div className={`me-3 ${styles.searchWrapper}`}>
            <input
              value={""}
              placeholder="Search by shift"
              className={`${styles.searchInput}`}
              onChange={() => {}}
              onKeyDown={() => {}}
            />
          </div>
          <div className={`me-3 ${styles.searchWrapper}`}>
            <span className={styles.searchIcon}>
              <CalendarIcon color={"var(--searchIcon-color)"} />
            </span>
            <input
              value={""}
              placeholder="Search by date"
              className={`${styles.searchInput}`}
              onChange={() => {}}
              onKeyDown={() => {}}
            />
          </div>
          <div className={`me-3 ${styles.searchWrapper}`}>
            <Controller
              name="shiftType"
              control={control}
              render={({ field: { onChange, name, value } }) => {
                return (
                  <SelectBox
                    inputForm
                    defaultSelector
                    placeholder="Select Remark"
                    options={[]}
                    onChange={onChange}
                    value={value}
                    instanceId={"remark"}
                  />
                );
              }}
            />
          </div>
          <div className="me-3 text-start">
            <button
              type="button"
              className={styles.searchBtn}
              onClick={() => {}}
            >
              Search
            </button>
          </div>
          <div className="text-start">
            <div className={styles.resetBtn} onClick={clearParams}>
              <span>Reset</span>
              <ResetIcon />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AttendanceHistoryHeader;
