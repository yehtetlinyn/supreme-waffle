import React from "react";
import commonStyles from "../styles/commonStyles.module.css";
import { MdArrowForwardIos } from "react-icons/md";
import { HiPlus } from "react-icons/hi";

const CustomBreadcrumb = ({
  title = "",
  breadcrumbList,
  handleBreadcrumbClick = () => {},
  leaveConfirm = false,
  createbtn,
  createBtnText = "",
  handleCreate,
  siteUser,
}) => {
  return (
    <div className={`${commonStyles.breadCrumbWrapper} ${siteUser && "mb-0"}`}>
      <p className={commonStyles.title}>{title}</p>
      {breadcrumbList?.map((item, index) => (
        <span
          key={index}
          className={
            index !== breadcrumbList.length - 1
              ? commonStyles.activeBreadcrumb
              : undefined
          }
          onClick={() => {
            index !== breadcrumbList.length - 1 && handleBreadcrumbClick(index);
          }}
        >
          {index !== 0 && <MdArrowForwardIos color="var(--primary-yellow)" />}
          {item}
        </span>
      ))}
      {createbtn && (
        <button
          className={commonStyles.searchBtn}
          onClick={handleCreate}
          style={{
            position: "absolute",
            top: "0",
            right: "0",
            display: "flex",
            alignItems: "center",
          }}
        >
          <HiPlus size={20} />
          {createBtnText}
        </button>
      )}
    </div>
  );
};

export default CustomBreadcrumb;
