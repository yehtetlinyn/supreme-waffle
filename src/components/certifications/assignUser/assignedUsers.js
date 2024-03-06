"use client";
import React, { useEffect, useState } from "react";
import commonStyles from "@/components/styles/commonStyles.module.css";
import styles from "./assignUser.module.css";
import AssignedUserList from "./assignedUserList";
import Paginate from "@/components/pagination/page";
import { useParams, useRouter } from "next/navigation";
import Loading from "@/components/modals/loading";
import { DELETE_CERTIFICATE_PROFILE } from "@/graphql/mutations/certificateProfile";
import apolloClient from "@/lib/apolloClient";
import { useMutation } from "@apollo/client";
import DeleteConfirmation from "@/components/modals/delete";
import useCertificateProfileStore from "@/store/certificateProfile";
import CustomBreadcrumb from "@/components/manageLayout/breadcrumb";
import useCertificationsStore from "@/store/certifications";
import NoData from "@/components/noData/noData";
import { TbTrash } from "react-icons/tb";
import { getUniqueAssignedUsers } from "@/utils/helpers";

const CertificateAssignedUsers = () => {
  const params = useParams();
  const router = useRouter();
  const {
    getCertificateProfiles,
    CertificateProfileInfo,
    loading,
    total,
    pageCount,
  } = useCertificateProfileStore((state) => state);
  const {
    getCertificates,
    certificateInfo,
    loading: certiInfoLoading,
  } = useCertificationsStore((state) => state);

  const [selectedCertificateProfile, setSelectedCertificateProfile] = useState(
    []
  );
  const [deleteModal, setDeleteModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const title = certificateInfo[0]?.name;
  const breadcrumbList = ["Certifications", title, "Assigned Users"];

  const handleBreadcrumbClick = (index) => {
    if (index === 0) {
      router.replace("/settings/certifications");
    } else if (index === 1) {
      router.replace(`/settings/certifications/view/${params.id}`);
    }
  };

  const fetchCertificateData = async () => {
    await getCertificateProfiles({
      where: { certificateId: +params.id, profileLimit: -1 },
    });

    await getCertificates({
      where: { id: params.id },
    });
  };

  useEffect(() => {
    fetchCertificateData();
  }, []);

  const [deleteCertificateProfileAction, { error: deleteError }] = useMutation(
    DELETE_CERTIFICATE_PROFILE,
    {
      client: apolloClient,
      onCompleted: (data) => {},
      onError: (error) => console.log(error),
    }
  );

  const deleteCertificateHandler = async () => {
    try {
      await Promise.all(
        selectedCertificateProfile?.map(async (certificateProfile) => {
          await deleteCertificateProfileAction({
            variables: { id: certificateProfile.id },
          });
        })
      );
    } catch (error) {
      console.log(error);
    }

    setDeleteModal(false);
    fetchCertificateData();
    setSelectedCertificateProfile([]);
  };

  if (loading) {
    <Loading />;
  } else {
    return (
      <>
        <CustomBreadcrumb
          title={title}
          breadcrumbList={breadcrumbList}
          handleBreadcrumbClick={handleBreadcrumbClick}
          createbtn={true}
          createBtnText="Create Certification"
          handleCreate={() => router.replace("/settings/certifications/create")}
        />
        <div className={styles.contentWrapper}>
          <div className={styles.headerContainer}>
            <div className={styles.flexRow}>
              <p>User List</p>
              <button
                className={commonStyles.searchBtn}
                onClick={() =>
                  router.push(
                    `/settings/certifications/view/${params?.id}/assignuser/create`
                  )
                }
                id="addButton"
              >
                Add Users to Certification
              </button>
            </div>
            <div className={styles.flexRow}>
              <span>Total Users</span>
              <span className={styles.badge}>
                {getUniqueAssignedUsers(CertificateProfileInfo).length}
              </span>
              <div style={{ marginLeft: "auto" }}>
                <span
                  onClick={() => setDeleteModal(true)}
                  className={
                    selectedCertificateProfile.length === 0
                      ? commonStyles.disabledDeleteBtn
                      : commonStyles.deleteBtn
                  }
                >
                  <TbTrash size={18} />
                  Delete
                </span>
              </div>
            </div>
          </div>
          <div style={{ flexGrow: "1", overflowY: "auto" }}>
            {loading ? (
              <Loading />
            ) : CertificateProfileInfo?.length > 0 ? (
              <AssignedUserList
                tableData={CertificateProfileInfo}
                selectedCertificateProfile={selectedCertificateProfile}
                setSelectedCertificateProfile={setSelectedCertificateProfile}
                setDeleteModal={setDeleteModal}
              />
            ) : (
              <div>
                <NoData />
              </div>
            )}
          </div>
          <small className={commonStyles.entriesText}>
            Showing {CertificateProfileInfo?.length} of {total} Entries
          </small>
          <div>
            <Paginate
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              pageCount={pageCount}
            />
          </div>
          <DeleteConfirmation
            isOpen={deleteModal}
            toggle={() => setDeleteModal(!deleteModal)}
            totalRows={selectedCertificateProfile.length}
            selectedRow={
              selectedCertificateProfile.length > 1
                ? `${selectedCertificateProfile.length} rows`
                : `Assigned Users id - ${selectedCertificateProfile[0]?.id}`
            }
            deleteHandler={deleteCertificateHandler}
          />
        </div>
      </>
    );
  }
};

export default CertificateAssignedUsers;
