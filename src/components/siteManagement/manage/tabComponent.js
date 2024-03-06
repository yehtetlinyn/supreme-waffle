"use client";
import React from "react";
import Link from "next/link";
import styles from "@/components/siteManagement/site.module.css";

import {
  useSearchParams,
  usePathname,
  useParams,
  useRouter,
} from "next/navigation";

import useSiteSopStore from "@/store/siteSopStore";
import useSiteUserStore from "@/store/siteUserStore";
import usePageStore from "@/store/pageStore";
import useSiteStore from "@/store/siteStore";
import { shallow } from "zustand/shallow";

const TabComponent = ({
  edit = false,
  view = false,
  createSite = false,
  check,
  checkpointCount,
  loading = false,
  shiftSettingsCount,
}) => {
  const siteSopCount = useSiteSopStore((state) => state.siteSopCount);
  const siteUsersCount = useSiteUserStore((state) => state.siteUsersCount);

  const searchParams = useSearchParams();
  const pathname = usePathname();

  const activeTabName = searchParams.get("tab") || "site";

  const handleLeaveOpen = usePageStore((state) => state.handleLeaveOpen);
  const setSiteTabName = usePageStore((state) => state.setSiteTabName);
  const siteTabName = usePageStore((state) => state.siteTabName);

  const isFormDirty = usePageStore((state) => state.isFormDirty);

  const { isSiteSopModalOpen, resetFormState } = useSiteSopStore(
    (state) => ({
      resetFormState: state.resetFormState,
      isSiteSopModalOpen: state.isSiteSopModalOpen,
    }),
    shallow
  );

  const tabs = createSite
    ? [{ name: "Site", tab: "site" }]
    : [
        { name: "Site", tab: "site" },
        { name: "Attendance Checkpoint", tab: "attendanceCheckpoint" },
        { name: "Shift Setting", tab: "shiftSetting" },
        { name: "SOP", tab: "sop" },
        { name: "Users", tab: "users" },
      ];

  const renderCount = (tab) => {
    if (tab === "attendanceCheckpoint") {
      return checkpointCount;
    } else if (tab === "shiftSetting") {
      return shiftSettingsCount;
    } else if (tab === "sop") {
      return siteSopCount;
    } else if (tab === "users") {
      return siteUsersCount;
    }
  };

  return (
    <div className={styles.tabWrapper}>
      {tabs.map((tab, index) => (
        <div key={tab?.name}>
          {((edit &&
            (activeTabName === "site" ||
              activeTabName === "attendanceCheckpoint" ||
              activeTabName === "shiftSetting")) ||
            (activeTabName === "sop" && isSiteSopModalOpen)) &&
          isFormDirty ? (
            <>
              <span
                className={
                  activeTabName === tab?.tab ? styles.selectedTab : undefined
                }
                onClick={() => {
                  if (activeTabName !== tab?.tab) {
                    handleLeaveOpen(true);
                  }
                  setSiteTabName(tab?.tab);
                }}
              >
                {tab?.name}
              </span>
              {tab?.tab !== "site" && (
                <span className={styles.count}>{renderCount(tab?.tab)}</span>
              )}
            </>
          ) : (
            <>
              <Link
                href={{
                  pathname: pathname,
                  query: tab?.tab === "site" ? {} : { tab: tab?.tab },
                }}
                className={
                  activeTabName === tab?.tab ? styles.selectedTab : undefined
                }
                onClick={() => {
                  resetFormState();
                }}
              >
                {tab?.name}
              </Link>
              {tab?.tab !== "site" && (
                <span className={styles.count}>{renderCount(tab?.tab)}</span>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default React.memo(TabComponent);
