import React from "react";
import { Card } from "reactstrap";
import dayjs from "dayjs";
import DatePicker from "react-datepicker";
import datepicker from "./style.module.css";
import "react-datepicker/dist/react-datepicker.css";
import CalendarIcon from "../icons/calendarIcon";

const CustomInput = ({
  value,
  noExpiredflag,
  enableStartDate,
  enableEndDate,
  custom,
  actionMode,
  onClick,
}) => {
  const isNoExpiredOrEmpty = noExpiredflag || !value;
  const isStartDateStyle = noExpiredflag && enableStartDate;
  const isDisabledState = noExpiredflag && enableEndDate;
  const isCustomStyle =
    (isStartDateStyle || value) && (noExpiredflag || !noExpiredflag);

  return (
    <Card className="shadow border-0">
      <button
        type="button"
        className={datepicker.customInput}
        onClick={actionMode === "view" ? () => {} : onClick}
        disabled={isDisabledState}
      >
        <span
          className={
            isCustomStyle ? datepicker.dataValue : datepicker.placeholder
          }
        >
          {isNoExpiredOrEmpty ? custom : value}
        </span>
        <span
          className={`${datepicker.customCalendarIcon} ${
            isDisabledState && datepicker.disabledIcon
          }`}
        >
          <CalendarIcon />
        </span>
      </button>
    </Card>
  );
};

const CustomDatePicker = ({
  selectedDate,
  onChange,
  actionMode,
  noExpiredflag = false,
  enableStartDate = false,
  enableEndDate = false,
}) => {
  const formatDate = (date) => {
    return dayjs(date).format("DD/MM/YYYY");
  };

  const startDate =
    noExpiredflag && selectedDate
      ? formatDate(selectedDate)
      : noExpiredflag
      ? formatDate(new Date())
      : selectedDate;
  const endDate = noExpiredflag ? "DD-MM-YYYY" : selectedDate;

  const custom =
    (enableStartDate && startDate) ||
    (enableEndDate && endDate) ||
    selectedDate;

  const customInput =
    ["create", "edit", "view"].includes(actionMode) && !noExpiredflag
      ? "DD-MM-YYYY"
      : custom;

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set time to midnight

  return (
    <div>
      <DatePicker
        selected={selectedDate}
        onChange={onChange}
        dateFormat="dd/MM/yyyy"
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        minDate={today}
        customInput={
          <CustomInput
            value={formatDate(selectedDate)}
            noExpiredflag={noExpiredflag}
            enableStartDate={enableStartDate}
            enableEndDate={enableEndDate}
            actionMode={actionMode}
            custom={customInput}
          />
        }
      />
    </div>
  );
};

export default CustomDatePicker;
