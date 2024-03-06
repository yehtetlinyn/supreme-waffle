import adminRoute from "@/routes/adminRoute";
import ccOperatorRoute from "@/routes/ccOperatorRoute";
import guardSupRoute from "@/routes/guardSupRoute";
import guardRoute from "@/routes/guardRoute";
import projectSupRoute from "@/routes/projectSupRoute";
import customerAdminRoute from "@/routes/customerAdminRoute";
import customerRoute from "@/routes/customerRoute";
import inspectorLeaderRoute from "@/routes/inspectorLeaderRoute";
import inspectorRoute from "@/routes/inspectorRoute";

export const accessibleRoutes = {
  admin: adminRoute,
  ccOperator: ccOperatorRoute,
  guardSup: guardSupRoute,
  guard: guardRoute,
  projectSup: projectSupRoute,
  customerAdmin: customerAdminRoute,
  customer: customerRoute,
  inspectorLeader: inspectorLeaderRoute,
  inspector: inspectorRoute,
};
