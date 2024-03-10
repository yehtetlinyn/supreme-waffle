"use client";
import React, { ReactNode } from "react";
import authStyles from "@/components/auth/auth.module.css";

type AuthPageProps = {
  children: ReactNode;
};

const AuthPageLayout = ({ children }: AuthPageProps) => {
  return (
    <div className={authStyles.root}>
      <div
        className={`d-flex flex-column align-items-center ${authStyles.formRoot}`}
      >
        {children}
      </div>
    </div>
  );
};

export default AuthPageLayout;
