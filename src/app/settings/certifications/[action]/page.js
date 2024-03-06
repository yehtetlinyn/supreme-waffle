import CreateCert from "@/components/certifications/create/page";
import React from "react";

const CreateAction = ({ params: { action } }) => {
  if (action === "create") {
    return (
      <>
        <CreateCert />
      </>
    );
  }
};

export default CreateAction;
