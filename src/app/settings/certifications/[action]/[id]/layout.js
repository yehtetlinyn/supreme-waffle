"use client";
import Loading from "@/components/modals/loading";
import useCertificationsStore from "@/store/certifications";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";

const ActionLayout = ({ children, params: { action, id } }) => {
  const router = useRouter();
  const param = useParams();
  const { getCertificates, certificateInfo, loading } = useCertificationsStore(
    (state) => state
  );

  const fetchCerti = async () => {
    await getCertificates({
      where: { id: +id },
    });
  };

  useEffect(() => {
    fetchCerti();
  }, []);

  if (loading) {
    return <Loading />;
  } else {
    return <>{children}</>;
  }
};

export default ActionLayout;
