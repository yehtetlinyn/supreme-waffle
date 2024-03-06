import React from "react";

import styles from "../project.module.css";
import Link from "next/link";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import useProjectStore from "@/store/project";
import { shallow } from "zustand/shallow";
import usePageStore from "@/store/pageStore";

const ProjectTabs = () => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const tabName = searchParams.get("tab");

  const { despatchCount, issueCount, participantCount, customerCount } =
    useProjectStore(
      (state) => ({
        despatchCount: state.despatchCount,
        issueCount: state.issueCount,
        participantCount: state.participantCount,
        customerCount: state.customerCount,
      }),
      shallow
    );

  const { isFormDirty, handleLeaveOpen } = usePageStore(
    (state) => ({
      isFormDirty: state.isFormDirty,
      handleLeaveOpen: state.handleLeaveOpen,
    }),
    shallow
  );

  const tabList = [
    { value: "project", name: "Project" },
    { value: "despatchTypes", name: "Despatch Types", count: despatchCount },
    { value: "issueTypes", name: "Issue Types", count: issueCount },
    { value: "participants", name: "Participants", count: participantCount },
    { value: "customer", name: "Customer Contact", count: customerCount },
  ];

  const handleTabClick = (value) => {
    if (isFormDirty) {
      useProjectStore.setState({
        leaveRedirectLink: `/settings/project/view/${params.id}?tab=${value}`,
      });
      handleLeaveOpen(true);
    } else {
      router.replace(`/settings/project/view/${params.id}?tab=${value}`);
    }
  };

  return (
    <div className={styles.tabContainer}>
      {tabList?.map((tab, index) => (
        <button
          className={
            tabName === tab.value ? styles.activeTab : styles.inActiveTab
          }
          onClick={() => handleTabClick(tab.value)}
        >
          {tab.name}
          {tab.value != "project" && (
            <div className={styles.badge}>{tab.count}</div>
          )}
        </button>
      ))}
    </div>
  );
};

export default ProjectTabs;
