"use client";
import React from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";

const PublicRoute = ({ children }) => {
	const router = useRouter();
	const { appLoading, isAuthenticated, success } = useAuthStore();

	useEffect(() => {
		if (!appLoading && isAuthenticated && !success) {
			router.push("/");
		}
	}, [appLoading, isAuthenticated]);

	return children;
};

export default PublicRoute;
