import React from "react";
import { Card } from "reactstrap";
import dayjs from "dayjs";
import DatePicker from "react-datepicker";
import timepicker from "./style.module.css";
import "react-datepicker/dist/react-datepicker.css";

const TimeInput = ({ value, startTime, endTime, onClick }) => {
  return (
    <Card className="border-0 shadow-0">
      <button
        type="button"
        className={timepicker.customInput}
        onClick={onClick}
      >
        <span className={value ? timepicker.dataValue : timepicker.placeholder}>
          {value ? value : startTime ? startTime : endTime ? endTime : null}
        </span>
      </button>
    </Card>
  );
};

const CustomTimePicker = ({
  selectedTime,
  onChange,
  startTime,
  endTime,
  enableStartTime = false,
  enableEndTime = false,
}) => {
  return (
    <div>
      <DatePicker
        selected={selectedTime}
        onChange={onChange}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={15}
        timeFormat="HH:mm"
        timeCaption="Time"
        customInput={
          <TimeInput
            value={selectedTime}
            startTime={startTime}
            endTime={endTime}
          />
        }
      />
    </div>
  );
};

export default CustomTimePicker;
