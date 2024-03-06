import OperationIcon from "@/assets/icons/operationIcon";
import OperationIconActive from "@/assets/icons/operationIconActive";

const guardSupRoute = [
  {
    collapse: true,
    name: "Site Operations",
    icon: <OperationIcon />,
    hoverAndActiveIcon: <OperationIconActive />,
    mainMenu: "siteOperations",
    subMenu: [
      {
        path: "/siteOperations/site",
        name: "Site",
        subMenu: "site",
      },
    ],
  },
];

export default guardSupRoute;
