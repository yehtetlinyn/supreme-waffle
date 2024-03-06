import React from "react";

export const PrimaryBtn = ({ handleClick, label }) => {
  return (
    <button className="primaryBtn" onClick={handleClick}>
      {label}
    </button>
  );
};
