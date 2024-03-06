import EditUser from "@/components/manageUser/editUser";
import ViewUser from "@/components/manageUser/viewUser";
import React from "react";

const page = ({ params: { action, id } }) => {
  return <>{action === "edit" ? <EditUser /> : <ViewUser />}</>;
};

export default page;
