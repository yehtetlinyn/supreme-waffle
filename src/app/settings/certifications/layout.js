import Layout from "@/components/layout/page";
import React from "react";

const layout = ({ children }) => {
  return (
    <div>
      <Layout>{children}</Layout>
    </div>
  );
};

export default layout;
