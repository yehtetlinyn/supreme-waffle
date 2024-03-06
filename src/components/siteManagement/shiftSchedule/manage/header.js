import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Controller, useForm } from "react-hook-form";
import { useEffect } from "react";
import SelectBox from "@/components/selectBox";
import shiftStyle from "../style.module.css";
import LoadingDots from "@/components/base/loadingDots";
import { RegularBtn } from "@/components/base/regularBtn";
import ToggleButtonGroup from "@/components/base/toggleBtnGroup";
import RegularBtnGroup from "@/components/base/regularBtnGroup";
import { getCurrentWeekLabel } from "@/utils/helpers";
import { getInitialStartingDay } from "@/utils/data";
import usePageStore from "@/store/pageStore";
import useShiftScheduleStore from "@/store/shiftScheduleStore";

const ShiftScheduleHeader = ({ setStartingDay, startingDay }) => {
  const currentWeekLabel = getCurrentWeekLabel(startingDay);
  const initialStartingDay = getInitialStartingDay();
  const { activeButton, selectedAccordion } = usePageStore((state) => ({
    activeButton: state.activeButton,
    selectedAccordion: state.selectedAccordion,
  }));
  const { shiftRosterOptions, shiftRostersData } = useShiftScheduleStore(
    (state) => ({
      shiftRostersData: state.shiftRostersData,
      shiftRosterOptions: state.shiftRosterOptions,
    })
  );
  const { control } = useForm();

  const handlePreviousClick = () => {
    setStartingDay((prevStartingDay) => prevStartingDay?.subtract(7, "day"));
  };

  const handleNextClick = () => {
    setStartingDay((prevStartingDay) => prevStartingDay?.add(7, "day"));
  };

  const handleResetClick = () => {
    setStartingDay(initialStartingDay);
  };

  return (
    <>
      <section className={shiftStyle.optionContent}>
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
                    placeholder="Select Shift Roster"
                    options={shiftRosterOptions}
                    onChange={onChange}
                    value={value}
                    instanceId={"shiftType"}
                  />
                );
              }}
            />
          </div>
          <div className="me-auto" style={{ marginLeft: "1rem" }}>
            Total Shift
          </div>
          <div className={shiftStyle.optionColumn}>
            <span className={shiftStyle.shiftCount}>
              {shiftRostersData ? shiftRostersData.length : "..."}
            </span>
          </div>
        </div>

        <div className={shiftStyle.optionsGroup}>
          <div className={shiftStyle.optionColumn}>
            <RegularBtn
              visibleBorder
              label={"Today"}
              handleClick={handleResetClick}
            />
          </div>
          <div className={shiftStyle.optionColumn}>
            <RegularBtnGroup
              visibleBorder
              primary={<FiChevronLeft size={20} />}
              secondary={<FiChevronRight size={20} />}
              primaryAction={handlePreviousClick}
              secondaryAction={handleNextClick}
            />
          </div>
          <div className={shiftStyle.optionColumn}>
            <ToggleButtonGroup
              visibleBorder
              primary={"Week"}
              secondary={"Month"}
            />
          </div>
        </div>
      </section>

      <div className={shiftStyle.optionContent}>
        <span className={shiftStyle.timeline}>
          {activeButton === 1 && currentWeekLabel}
        </span>
      </div>
    </>
  );
};

export default ShiftScheduleHeader;
