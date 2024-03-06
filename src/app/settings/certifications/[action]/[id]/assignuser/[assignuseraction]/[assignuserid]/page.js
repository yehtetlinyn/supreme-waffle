import EditAssignedUsers from "@/components/certifications/assignUser/editAssignedUsers";
import React from "react";

const UpdateAssignedUsers = ({ params: { assignuseraction } }) => {
  if (assignuseraction === "edit") {
    return <EditAssignedUsers />;
  }
};

export default UpdateAssignedUsers;
