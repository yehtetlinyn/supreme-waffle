import React from "react";
import { ButtonGroup } from "reactstrap";
import groupStyle from "./style.module.css";

const RegularBtnGroup = ({
  primary,
  secondary,
  primaryAction,
  secondaryAction,
  visibleBorder = false,
}) => {
  return (
    <ButtonGroup>
      <button
        type="button"
        onClick={primaryAction}
        className={`${
          visibleBorder ? groupStyle.borderedBtn : groupStyle.inactiveBtn
        }`}
        style={{ borderTopLeftRadius: "6px", borderBottomLeftRadius: "6px" }}
      >
        {primary}
      </button>
      <button
        type="button"
        onClick={secondaryAction}
        className={`${
          visibleBorder ? groupStyle.borderedBtn : groupStyle.inactiveBtn
        }`}
        style={{ borderTopRightRadius: "6px", borderBottomRightRadius: "6px" }}
      >
        {secondary}
      </button>
    </ButtonGroup>
  );
};

export default RegularBtnGroup;
