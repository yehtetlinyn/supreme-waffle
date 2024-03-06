import usePageStore from "@/store/pageStore";
import manageTab from "./style.module.css";
import AgencyMobileIndex from "../mobile/page";
import AgencyWebIndex from "../web/page";
import TabChangers from "./tabChangers";

const AgencySettingManagement = () => {
  const { agencySettingTab, setCurrentTab } = usePageStore((state) => ({
    agencySettingTab: state.agencySettingTab,
    setCurrentTab: state.setCurrentTab,
  }));

  return (
    <section>
      <div className={manageTab.container}>
        <TabChangers
          currentTab={agencySettingTab}
          setCurrentTab={setCurrentTab}
        />
        {agencySettingTab === "mobile" && <AgencyMobileIndex />}
        {agencySettingTab === "web" && <AgencyWebIndex />}
      </div>
    </section>
  );
};

export default AgencySettingManagement;
