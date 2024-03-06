"use client";
import _ from "lodash";
import React from "react";
import useAuthStore from "@/store/authStore";
import Redirect from "@/components/route/Redirect";

const ProtectRoute = ({ children, allowTo = [] }) => {
  const { isAuthenticated, user, appLoading } = useAuthStore();

  // If user is not authenticated, redirect to login page
  if (!isAuthenticated && !appLoading) {
    return <Redirect to="/auth/login" />;
  }

  // If user is authenticated but not allowed to access the page, throw a Forbidden error
  if (isAuthenticated && !allowTo[user?.role?.name]) {
    let error = new Error();
    error.name = "Forbidden";
    error.statusCode = 403;
    error.message = "You don't have permissions to access the page.";

    throw error;
  }

  // Render children when app loaded and no errors
  if (!appLoading) {
    return children;
  }

  // If the app is still loading, return null
  return null;
};

export default ProtectRoute;
