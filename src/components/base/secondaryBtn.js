import React from "react";

export const SecondaryBtn = ({ handleClick, label }) => {
  return (
    <button className="secondaryBtn" onClick={handleClick}>
      {label}
    </button>
  );
};
