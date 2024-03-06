"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import PageLoader from "@/components/base/pageLoader";

export default function Home() {
	const router = useRouter();
	const { isAuthenticated, appLoading } = useAuthStore();

	useEffect(() => {
		if (!appLoading && isAuthenticated) {
			router.push("/dashboard");
		}

		if (!appLoading && !isAuthenticated) {
			router.push("/auth/login");
		}
	}, [isAuthenticated, appLoading]);

	return <PageLoader />;
}
