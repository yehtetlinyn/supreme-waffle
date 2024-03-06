import TabButton from "@/components/base/tabButton";
import tabStyle from "./style.module.css";

const TabChangers = ({ currentTab, setCurrentTab }) => {
  const changeTab = (tab) => {
    setCurrentTab("agencySettingTab", tab);
  };

  return (
    <div className={tabStyle.tabchangers}>
      <TabButton
        tab="mobile"
        label="Mobile"
        handleToggle={changeTab}
        active={currentTab === "mobile"}
      />
      <TabButton
        tab="web"
        label="Web Portal"
        handleToggle={changeTab}
        active={currentTab === "web"}
      />
    </div>
  );
};

export default TabChangers;
