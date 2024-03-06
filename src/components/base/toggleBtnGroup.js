import React, { useState } from "react";
import { ButtonGroup } from "reactstrap";
import groupStyle from "./style.module.css";
import usePageStore from "@/store/pageStore";

const ToggleButtonGroup = ({ primary, secondary, visibleBorder = false }) => {
  const activeBtn = visibleBorder
    ? groupStyle.borderedActiveBtn
    : groupStyle.activeBtn;
  const inactiveBtn = visibleBorder
    ? groupStyle.borderedInactiveBtn
    : groupStyle.inactiveBtn;

  const { activeButton, setActiveButton } = usePageStore((state) => ({
    activeButton: state.activeButton,
    setActiveButton: state.setActiveButton,
  }));

  const handleButtonClick = (buttonNumber) => {
    setActiveButton(buttonNumber);
  };

  return (
    <ButtonGroup>
      <button
        className={`${activeButton === 1 ? activeBtn : inactiveBtn}`}
        style={{ borderTopLeftRadius: "6px", borderBottomLeftRadius: "6px" }}
        onClick={() => handleButtonClick(1)}
      >
        {primary}
      </button>
      <button
        className={`${activeButton === 2 ? activeBtn : inactiveBtn}`}
        style={{ borderTopRightRadius: "6px", borderBottomRightRadius: "6px" }}
        onClick={() => handleButtonClick(2)}
      >
        {secondary}
      </button>
    </ButtonGroup>
  );
};

export default ToggleButtonGroup;
