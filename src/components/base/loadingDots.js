import React from "react";
import loadingStyle from "./style.module.css";

const LoadingDots = () => {
  return (
    <span className={loadingStyle["loading-dots-container"]}>
      {[...Array(3)].map((_, i) => (
        <span
          key={i}
          className={`${loadingStyle["loading-dot"]} ${
            i === 0
              ? loadingStyle["first-dot"]
              : i === 1
              ? loadingStyle["second-dot"]
              : loadingStyle["third-dot"]
          }`}
        >
          .
        </span>
      ))}
    </span>
  );
};

export default LoadingDots;
