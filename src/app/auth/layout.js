"use client";
import React from "react";
import authStyles from "@/components/auth/auth.module.css";
const AuthPageLayout = ({ children }) => {
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
