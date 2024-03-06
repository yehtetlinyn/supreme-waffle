import React from "react";
import tabButton from "./style.module.css";

const TabButton = ({ tab, label, active, handleToggle }) => {
  return (
    <button
      className={`${tabButton["tab-btn"]} ${active && tabButton.active}`}
      onClick={() => handleToggle(tab)}
    >
      <div className="d-flex flex-grow-1 flex-column align-items-start">
        <span className="label">{label}</span>
      </div>
    </button>
  );
};

export default TabButton;
