import AssignUserIndex from "@/components/certifications/assignUser/page";
import React from "react";

const CreateAssignUser = ({ params: { assignuseraction } }) => {
  if (assignuseraction === "create") {
    return <AssignUserIndex />;
  }
};

export default CreateAssignUser;
