import CreateNewUser from "@/components/manageUser/createNewUser";
import React from "react";

const ManageUserAction = ({ params: { action } }) => {
  return <>{action === "create" && <CreateNewUser />}</>;
};

export default ManageUserAction;
