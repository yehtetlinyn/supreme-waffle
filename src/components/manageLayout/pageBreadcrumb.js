"use client";
import React, { useEffect, useState } from "react";
import commonStyles from "../styles/commonStyles.module.css";
import Link from "next/link";
import { MdArrowForwardIos } from "react-icons/md";

import { HiPlus } from "react-icons/hi";
import { useSearchParams } from "next/navigation";
import usePageStore from "@/store/pageStore";
import useSiteStore from "@/store/siteStore";

const PageBreadcrumb = ({
  title,
  first,
  second = "",
  third,
  createbtn,
  createBtnText = "",
  handleCreate,
  id = "",
  view = false,
  create = false,
  enableLeaveModal = false,
}) => {
  const searchParams = useSearchParams();
  const activeTabName = searchParams.get("tab");

  const fetchSiteName = useSiteStore((state) => state.fetchSiteName);
  const viewPageBreadcrumbName = useSiteStore((state) => state.siteName);
  const handleLeaveOpen = usePageStore((state) => state.handleLeaveOpen);

  const handleClickSecondBreadcrumb = usePageStore(
    (state) => state.handleClickSecondBreadcrumb
  );

  const firstLink =
    first.toLowerCase() === "mastersop" ? "masterSOP" : first.toLowerCase();

  useEffect(() => {
    // for site module
    if (first.toLowerCase() === "site" && !create) {
      fetchSiteName(id);
    }
  }, []);

  return (
    <div className={commonStyles.breadCrumbWrapper}>
      <p className={commonStyles.title}>
        {title == "masterSOP" ? "Master SOP" : title}
      </p>
      {!enableLeaveModal ? (
        <Link href={`/${firstLink}`}>
          <span>{first == "masterSOP" ? "Master SOP" : first}</span>
        </Link>
      ) : (
        <span className={commonStyles.pointer}>
          <span
            onClick={() => {
              handleLeaveOpen(true);
              handleClickSecondBreadcrumb(false);
            }}
            className={commonStyles.secondBreadcrumb}
          >
            {first == "masterSOP" ? "Master SOP" : first}
          </span>
        </span>
      )}

      {(second || viewPageBreadcrumbName) &&
        !view &&
        ((!enableLeaveModal && (
          <Link
            href={{
              pathname: `/${firstLink}/view/${id}`,
              query: activeTabName ? { tab: activeTabName } : {},
            }}
          >
            <span className={commonStyles.secondBreadcrumb}>
              <MdArrowForwardIos color="var(--primary-yellow)" />
              {second ? second : viewPageBreadcrumbName}
            </span>
          </Link>
        )) || (
          <span
            onClick={() => {
              handleLeaveOpen(true);
              handleClickSecondBreadcrumb(true);
            }}
            className={commonStyles.pointer}
          >
            <span className={commonStyles.secondBreadcrumb}>
              <MdArrowForwardIos color="var(--primary-yellow)" />
              {second ? second : viewPageBreadcrumbName}
            </span>
          </span>
        ))}
      <span className="text-capitalize">
        <MdArrowForwardIos color="var(--primary-yellow)" />
        {third ? third : viewPageBreadcrumbName}
      </span>
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

export default PageBreadcrumb;
