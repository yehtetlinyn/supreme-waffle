import CertificationIcon from "@/assets/icons/certificationIcon";
import DashboardIcon from "@/assets/icons/dashboardIcon";
import PositionIcon from "@/assets/icons/positionIcon";
import PositionIconActive from "@/assets/icons/positionIconActive";
import AnnouncementIcon from "@/assets/icons/announcementIcon";
import NewsIcon from "@/assets/icons/newsIcon";
import SiteIconActive from "@/assets/icons/siteIconActive";
import SettingIcon from "@/assets/icons/settingIcon";
import SiteIcon from "@/assets/icons/siteIcon";
import ManageUser from "@/assets/icons/manageUserIcon";
import ManageUserActive from "@/assets/icons/manageUserActive";
import OperationIcon from "@/assets/icons/operationIcon";
import OperationIconActive from "@/assets/icons/operationIconActive";
import AgencyIcon from "@/assets/icons/agencyIcon";

const adminRoute = [
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
    name: "Despatch Operations",
    icon: <OperationIcon />,
    hoverAndActiveIcon: <OperationIconActive />,
    mainMenu: "despatchOperations",
    subMenu: [
      {
        path: "/despatchOperations/dashboard",
        name: "Dashboard",
        subMenu: "dashboard",
      },
      {
        path: "/despatchOperations/assignments",
        name: "Assignments",
        subMenu: "assignments",
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
        path: "/settings/manageUsers",
        name: "Users",
        subMenu: "manageUsers",
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
      {
        path: "/settings/agency",
        name: "Agency",
        subMenu: "agency",
      },
    ],
  },
];

export default adminRoute;
