import React from "react";
import dynamic from "next/dynamic";
import { accessibleRoutes } from "@/utils/routes";

const ProtectRoute = dynamic(() => import("@/components/route/ProtectRoute"), {
  ssr: false,
});

const DashboardLayout = ({ children }) => {
  return <ProtectRoute allowTo={accessibleRoutes}>{children}</ProtectRoute>;
};

export default DashboardLayout;
