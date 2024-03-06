
import CustomBreadcrumb from "../manageLayout/breadcrumb";
import AgencySettingManagement from "./manage/page";

const AgencyManagement = () => {
  const breadcrumbList = ["Setting", "Agency Setting"];

  return (
    <>
      <CustomBreadcrumb
        title={"Agency Setting"}
        breadcrumbList={breadcrumbList}
      />
      <AgencySettingManagement />
    </>
  );
};

export default AgencyManagement;
