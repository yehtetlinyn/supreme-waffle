"use client";
import { useEffect } from "react";
import Header from "./header";
import Sidebar from "./sidebar";

import { accessibleRoutes } from "@/utils/routes";

import styles from "@/components/layout/layout.module.css";
import useAgencySettingStore from "@/store/agencySettingStore";
import useAuthStore from "@/store/authStore";

export default function Layout({ children }) {
  const { user } = useAuthStore();
  const { getAgencySettings, theme } = useAgencySettingStore((state) => ({
    getAgencySettings: state.getAgencySettings,
    theme: state.theme,
  }));

  useEffect(() => {
    getAgencySettings();
  }, []);

  return (
    <div className={styles.pageContainer}>
      <Sidebar routes={accessibleRoutes[user?.role?.name]} />
      <div className={styles.bodyContainer}>
        <Header />
        <div className={styles.contentContainer}>
          <div className={styles.contentWrapper}>
            <main className={styles.content}>{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
}
