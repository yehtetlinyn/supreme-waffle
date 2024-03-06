import OperationIcon from "@/assets/icons/operationIcon";
import OperationIconActive from "@/assets/icons/operationIconActive";

const inspectorRoute = [
  {
    collapse: true,
    name: "Despatch Operations",
    icon: <OperationIcon />,
    hoverAndActiveIcon: <OperationIconActive />,
    mainMenu: "despatchOperations",
    subMenu: [
      {
        path: "/despatchOperations/assignments",
        name: "Assignments",
        subMenu: "assignments",
      },
    ],
  },
];

export default inspectorRoute;
