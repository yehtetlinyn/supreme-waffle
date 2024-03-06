"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import PageLoader from "@/components/base/pageLoader";

function Redirect({ to }) {
	const router = useRouter();

	useEffect(() => {
		router.push("/");
	}, [to]);

	return <PageLoader />;
}

export default Redirect;
