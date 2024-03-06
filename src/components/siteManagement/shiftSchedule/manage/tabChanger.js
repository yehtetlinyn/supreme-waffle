import TabButton from "@/components/base/tabButton";
import tabStyle from "@/components/setting/manage/style.module.css";

const TabChangers = ({ currentTab, setCurrentTab }) => {
  const changeTab = (tab) => {
    setCurrentTab("shiftRosterTab", tab);
  };

  return (
    <div className={tabStyle.tabchangers}>
      <TabButton
        tab="rosterAssignment"
        label="Roster Assignment"
        handleToggle={changeTab}
        active={currentTab === "rosterAssignment"}
      />
      <TabButton
        tab="checkpoints"
        label="Checkpoints"
        handleToggle={changeTab}
        active={currentTab === "checkpoints"}
      />
      <TabButton
        tab="attendanceHistory"
        label="Attendance History"
        handleToggle={changeTab}
        active={currentTab === "attendanceHistory"}
      />
    </div>
  );
};

export default TabChangers;
