import { useState } from "react";
import styles from "@/components/styles/commonStyles.module.css";

const TruncatedText = ({
  text,
  maxLength,
  customColor = "var(--primary-font)",
  cursor = "default",
}) => {
  const [isTruncated, setIsTruncated] = useState(true);

  const toggleTruncated = () => {
    setIsTruncated(!isTruncated);
  };

  const truncatedText =
    isTruncated && text !== null && text?.length > maxLength
      ? text?.slice(0, maxLength) + "..."
      : text;

  return (
    <button
      type="button"
      className={styles.removeBtnProps}
      onClick={toggleTruncated}
      style={{ cursor: cursor }}
    >
      <span style={{ color: customColor }}>{truncatedText}</span>
    </button>
  );
};

export default TruncatedText;
