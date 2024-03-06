import React from "react";

const calculateStrength = (password) => {
  if (password.length === 0) {
    return 0; // Empty password has no strength
  }

  const minLengthRegex = /.{8,}/;
  const uppercaseRegex = /[A-Z]/;
  const maxIdenticalRegex = /([a-zA-Z])\1{1,}/;
  const numberRegex = /[0-9]/;
  const lowercaseRegex = /[a-z]/;
  const specialCharRegex = /[!@#$%^&*()_+[\]{};':"\\|,.<>/?]+/;

  let strengthValue = 0;

  if (minLengthRegex.test(password)) {
    // console.log("Min length");
    strengthValue += 1;
  }
  if (uppercaseRegex.test(password)) {
    strengthValue += 1;
  }
  if (maxIdenticalRegex.test(password)) {
    strengthValue += 1;
  }
  if (numberRegex.test(password)) {
    strengthValue += 1;
  }
  if (lowercaseRegex.test(password)) {
    strengthValue += 1;
  }
  if (specialCharRegex.test(password)) {
    strengthValue += 1;
  }

  return strengthValue;
};

const getStrengthLabel = (strengthValue) => {
  if (strengthValue === 0) {
    return null; // No Password
  } else if (strengthValue <= 2) {
    return "Weak";
  } else if (strengthValue <= 4) {
    return "Fair";
  } else {
    return "Strong";
  }
};

const getStrengthLabelClass = (strengthValue) => {
  if (strengthValue === 0) {
    return "text-muted"; // Gray for No Password
  } else if (strengthValue <= 2) {
    return "text-danger"; // Red for Weak
  } else if (strengthValue <= 4) {
    return "text-warning"; // Yellow for Fair
  } else {
    return "text-success"; // Green for Strong
  }
};

const calculateProgressBarClass = (strengthValue) => {
  if (strengthValue === 0) {
    return "bg-muted"; // Gray for No Password
  } else if (strengthValue <= 2) {
    return "bg-danger"; // Red for Weak
  } else if (strengthValue <= 4) {
    return "bg-warning"; // Yellow for Fair
  } else {
    return "bg-success"; // Green for Strong
  }
};

function StrengthBar({ password }) {
  const strengthValue = calculateStrength(password);

  return (
    <div>
      <div className="progress mt-2" style={{ height: "6px" }}>
        <div
          className={`progress-bar ${calculateProgressBarClass(strengthValue)}`}
          role="progressbar"
          style={{ width: `${(strengthValue / 6) * 100}%` }}
        ></div>
      </div>
      <div className="d-flex justify-content-end">
        {/* {strengthValue === 0 && (
          <p className={getStrengthLabelClass(strengthValue)}>No Password</p>
        )} */}
        <p className={`${getStrengthLabelClass(strengthValue)}`}>
          <small>{getStrengthLabel(strengthValue)}</small>
        </p>
      </div>
    </div>
  );
}

export default StrengthBar;
