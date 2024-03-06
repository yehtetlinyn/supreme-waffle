"use client";
import React, { useState } from "react";
import styles from "@/components/siteManagement/site.module.css";
import { useEffect } from "react";

const MultiSelectDayPicker = ({
  value,
  onChange,
  index,
  view,
  selectRef,
  setError,
  clearErrors,
  isAddMoreClick,
  setIsAddMoreClick,
  errors,
}) => {
  const days = [
    { label: "MO", value: "Mon" },
    { label: "TU", value: "Tue" },
    { label: "WE", value: "Wed" },
    { label: "TH", value: "Thu" },
    { label: "FR", value: "Fri" },
    { label: "SA", value: "Sat" },
    { label: "SU", value: "Sun" },
  ];
  const [firstRender, setFirstRender] = useState(true);

  const hasErrorInOtherFields =
    ["title", "startTime", "endTime", "headCount"].some(
      (field) => errors?.shiftSetting?.[index]?.[field]
    ) || false;

  useEffect(() => {
    if (!firstRender && (hasErrorInOtherFields || isAddMoreClick)) {
      if (value?.length === 0) {
        setError(`shiftSetting.${index}.selectedDays`, {
          type: "required",
          message: "You have to provide a value for a required field.",
        });
      } else {
        clearErrors(`shiftSetting.${index}.selectedDays`);
      }
    }
    return () => {
      setFirstRender(false);
    };
  }, [value?.length]);

  useEffect(() => {
    if (Object.keys(errors).length === 0) {
      setIsAddMoreClick(false);
    }
  }, [errors]);

  const handleDayToggle = (selectedDay) => {
    if (value?.includes(selectedDay)) {
      onChange(value?.filter((day) => day !== selectedDay));
    } else {
      onChange([...value, selectedDay]);
    }
  };

  return (
    <div className="d-flex">
      {days.map((day) => (
        <div
          className={view ? styles.viewWeekDaySelector : styles.weekDaySelector}
          key={day?.value}
        >
          <input
            ref={selectRef}
            type="checkbox"
            disabled={view}
            id={`weekday${index}-${day.value}`}
            checked={value?.includes(day?.value)}
            onChange={() => handleDayToggle(day?.value)}
          />
          <label htmlFor={`weekday${index}-${day.value}`}>{day?.label}</label>
        </div>
      ))}
    </div>
  );
};

export default MultiSelectDayPicker;
