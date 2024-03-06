import React from "react";
import Switch from "react-switch";
import buttonStyle from "./style.module.css";

const ToggleSwitchButton = ({
  checked = false,
  handleChange,
  isReadOnly = false,
}) => {
  return (
    <div className={buttonStyle.toggleSwitch}>
      <Switch
        width={48}
        height={24}
        borderRadius={20}
        handleDiameter={16}
        checked={checked}
        onChange={handleChange}
        checkedIcon={false}
        uncheckedIcon={false}
        onColor="#599cff"
        onHandleColor="#ffffff"
        disabled={isReadOnly}
        activeBoxShadow="0px 0px 1px 5px rgba(0, 0, 0, 0.2)"
      />
    </div>
  );
};

export default ToggleSwitchButton;
