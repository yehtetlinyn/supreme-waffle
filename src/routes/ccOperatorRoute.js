import DashboardIcon from "@/assets/icons/dashboardIcon";
import SettingIcon from "@/assets/icons/settingIcon";
import OperationIcon from "@/assets/icons/operationIcon";
import OperationIconActive from "@/assets/icons/operationIconActive";
import AgencyIcon from "@/assets/icons/agencyIcon";

const ccOperatorRoute = [
  {
    collapse: false,
    name: "Dashboard",
    icon: <DashboardIcon />,
    hoverAndActiveIcon: <DashboardIcon />,
    path: "/dashboard",
    mainMenu: "dashboard",
  },
  {
    collapse: true,
    name: "Site Operations",
    icon: <OperationIcon />,
    hoverAndActiveIcon: <OperationIconActive />,
    mainMenu: "siteOperations",
    subMenu: [
      {
        path: "/siteOperations/dashboard",
        name: "Dashboard",
        subMenu: "dashboard",
      },
      {
        path: "/siteOperations/site",
        name: "Site",
        subMenu: "site",
      },
    ],
  },
  {
    collapse: true,
    name: "Agency",
    icon: <AgencyIcon />,
    hoverAndActiveIcon: <AgencyIcon />,
    mainMenu: "agency",
    subMenu: [
      {
        path: "/agency/announcement",
        name: "Announcements",
        subMenu: "announcement",
      },
      {
        path: "/agency/news",
        name: "News",
        subMenu: "news",
      },
      {
        path: "/agency/masterSOP",
        name: "Master SOP",
        subMenu: "masterSOP",
      },
    ],
  },
  {
    collapse: true,
    name: "Settings",
    icon: <SettingIcon />,
    hoverAndActiveIcon: <SettingIcon />,
    mainMenu: "settings",
    subMenu: [
      {
        path: "/settings/site",
        name: "Site",
        subMenu: "site",
      },
      {
        path: "/settings/project",
        name: "Project",
        subMenu: "project",
      },
      {
        path: "/settings/positions",
        name: "Positions",
        subMenu: "positions",
      },
      {
        path: "/settings/certifications",
        name: "Certifications",
        subMenu: "certifications",
      },
    ],
  },
];

export default ccOperatorRoute;
