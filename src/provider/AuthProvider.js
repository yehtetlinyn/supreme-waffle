"use client";
import React, { useEffect } from "react";
import useAuthStore from "@/store/authStore";

const AuthProvider = ({ children }) => {
	const { getSession } = useAuthStore();

	useEffect(() => {
		const getAuthenticatedUser = async () => {
			await getSession();
		};

		getAuthenticatedUser();
	}, []);

	return children;
};

export default AuthProvider;
