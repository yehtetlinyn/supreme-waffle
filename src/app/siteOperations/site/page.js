import React from "react";
import Layout from "@/components/layout/page";
import SiteManagement from "@/components/siteManagement/manage/page";

const SiteIndex = () => {
  // site lists table
  return (
    <Layout>
      <SiteManagement siteOperations />
    </Layout>
  );
};

export default SiteIndex;
