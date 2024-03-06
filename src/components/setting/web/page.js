import React from "react";
import agencyWeb from "./style.module.css";
import BrandForm from "./brandForm";
import PreviewForm from "./previewForm";

const AgencyWebIndex = () => {
  return (
    <section>
      <div className={agencyWeb.cardContainer}>
        <div className={agencyWeb.cardColumn}>
          <BrandForm />
        </div>
        <div className={agencyWeb.cardColumn}>
          <PreviewForm />
        </div>
      </div>
    </section>
  );
};

export default AgencyWebIndex;
