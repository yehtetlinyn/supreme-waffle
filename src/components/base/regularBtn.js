import React from "react";
import btnStyle from "./style.module.css";

export const RegularBtn = ({ handleClick, label, visibleBorder }) => {
  return (
    <button
      className={`${visibleBorder ? btnStyle.regularBorderBtn : "regularBtn"}`}
      onClick={handleClick}
    >
      {label}
    </button>
  );
};
