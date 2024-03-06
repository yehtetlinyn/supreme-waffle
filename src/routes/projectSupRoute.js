import OperationIcon from "@/assets/icons/operationIcon";
import OperationIconActive from "@/assets/icons/operationIconActive";

const projectSupRoute = [
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
];

export default projectSupRoute;
