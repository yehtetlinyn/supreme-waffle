"use client";
import ContentWrap from "@/components/contentWrap/page";
import ManageHeader from "@/components/manageLayout/manageHeader";
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import CertificationsFilter from "./filter";
import CertificationList from "./certificationsList";
import Paginate from "@/components/pagination/page";

import useCertificationsStore from "@/store/certifications";
import Loading from "@/components/modals/loading";
import {
  DELETE_CERTIFICATE,
  UPDATE_CERTIFICATE,
} from "@/graphql/mutations/certificate";
import { useMutation } from "@apollo/client";
import apolloClient from "@/lib/apolloClient";
import DeleteConfirmation from "@/components/modals/delete";
import NoData from "@/components/noData/noData";

const ManageCertifications = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  const providedBy = searchParams.get("providedBy");
  const trainingLocation = searchParams.get("traininglocation");

  const [selectedCertificates, setSelectedCertificates] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);

  const { getCertificates, certificateInfo, loading, total, pageCount } =
    useCertificationsStore((state) => state);

  const fetchCertificationsData = async () => {
    let variables = {};
    variables.name = name || undefined;
    variables.providedBy = providedBy || undefined;
    variables.trainingLocation = trainingLocation || undefined;
    variables.deleted = false;
    variables.page = currentPage;
    variables.pageSize = 10;
    variables.profileLimit = -1;
    await getCertificates({
      where: variables,
    });
  };

  //Fetch by page number
  useEffect(() => {
    fetchCertificationsData();
  }, [currentPage, name, trainingLocation, providedBy]);

  //If the fetched pagination is less than current page No.,
  //set current page to 1
  useMemo(() => {
    if (currentPage > pageCount && !loading) {
      setCurrentPage(pageCount);
    }
  }, [pageCount]);

  const [updateCertificateAction] = useMutation(UPDATE_CERTIFICATE, {
    client: apolloClient,
    onError: (error) => console.log(error),
  });

  const deleteCertificateHandler = async () => {
    try {
      await Promise.all(
        selectedCertificates.map(async (certificate) => {
          await updateCertificateAction({
            variables: { id: certificate.id, data: { deleted: true } },
          });
        })
      );
    } catch (error) {
      console.log(error);
    }

    setDeleteModal(false);
    fetchCertificationsData();
    setSelectedCertificates([]);
  };

  return (
    <>
      <ContentWrap
        pageHeader={
          <ManageHeader
            title={"Certifications"}
            handleAddNew={() => router.push("/settings/certifications/create")}
            create={"Certification"}
          />
        }
        filterRow={<CertificationsFilter />}
        subTitle={"Total Certifications"}
        listCount={loading ? "Loading..." : total}
        deleteBtn="Delete"
        disable={selectedCertificates.length === 0}
        deleteConfirmationModalHandler={() => setDeleteModal(!deleteModal)}
        content={
          loading ? (
            <Loading />
          ) : certificateInfo?.length > 0 ? (
            <CertificationList
              tableData={certificateInfo || []}
              selectedCertificates={selectedCertificates}
              setSelectedCertificates={setSelectedCertificates}
              setDeleteModal={setDeleteModal}
            />
          ) : (
            <div>
              <NoData />
            </div>
          )
        }
        totalCount={loading ? 0 : total}
        showingCount={loading ? 0 : certificateInfo.length}
        loading={loading}
        footer={
          total > 0 && (
            <Paginate
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              pageCount={pageCount}
            />
          )
        }
      />
      <DeleteConfirmation
        isOpen={deleteModal}
        toggle={() => setDeleteModal(!deleteModal)}
        totalRows={selectedCertificates.length}
        selectedRow={
          selectedCertificates.length > 1
            ? `${selectedCertificates.length} certificates`
            : `${selectedCertificates[0]?.name}`
        }
        deleteHandler={deleteCertificateHandler}
      />
    </>
  );
};

export default ManageCertifications;
