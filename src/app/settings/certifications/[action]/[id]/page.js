"use client";
import CertActionForm from "@/components/certifications/actions/form";
import EditCert from "@/components/certifications/edit/page";
import ViewCert from "@/components/certifications/view/page";
import React, { useEffect } from "react";
import Loading from "@/components/modals/loading";
import useCertificationsStore from "@/store/certifications";
import ViewCerti from "@/components/certifications/view/page";

const CertActions = ({ params: { action, id } }) => {
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

  switch (true) {
    case action === "edit":
      return loading ? (
        <Loading />
      ) : (
        <EditCert fetchedData={certificateInfo[0]} />
      );
    case action === "view":
      return loading ? (
        <Loading />
      ) : (
        <ViewCerti fetchedData={certificateInfo[0]} />
      );
  }
};

export default CertActions;
