import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BiCalendarAlt } from "react-icons/bi";

import commonStyles from "../../styles/commonStyles.module.css";
import styles from "./assignUser.module.css";

const CustomDatePicker = ({
  selectedDate,
  fieldName,
  onChange,
  disabled,
  error,
  arrow,
}) => {
  return (
    <label className={styles.datepickerContainer}>
      <BiCalendarAlt size={20} />
      <DatePicker
        className={
          error
            ? [commonStyles.errorFormInputBox, styles.datepickerWrapper]
            : [commonStyles.formInputBox, styles.datepickerWrapper]
        }
        selected={selectedDate}
        onChange={onChange}
        placeholderText="Choose Date"
        showYearDropdown
        dateFormatCalendar="MMMM"
        yearDropdownItemNumber={15}
        scrollableYearDropdown
        disabled={disabled}
        dateFormat="dd/MM/yyyy"
        showPopperArrow={arrow}
      />
    </label>
  );
};

export default CustomDatePicker;
