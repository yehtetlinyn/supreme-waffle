"use client";
import useUsersStore from "@/store/user";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import CustomBreadcrumb from "../manageLayout/breadcrumb";
import commonStyles from "../styles/commonStyles.module.css";
import styles from "./manageUser.module.css";
import AccountInformation from "./accountInformation";
import ProfileInformation from "./profileInformation";
import { GrEdit } from "react-icons/gr";
import Link from "next/link";

const ViewUser = () => {
  const router = useRouter();
  const params = useParams();
  const [userName, setUserName] = useState("");
  const [breadcrumbList, setBreadcrumbList] = useState([]);
  const [accountInfo, setAccountInfo] = useState({});
  const [profileInfo, setProfileInfo] = useState({});

  const { getUsers, userInfo, loading } = useUsersStore((state) => ({
    getUsers: state.getUsers,
    userInfo: state.userInfo,
    loading: state.loading,
  }));

  const fetchUserData = async () => {
    await getUsers({
      where: {
        id: params?.id,
      },
    });
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useMemo(() => {
    setUserName(userInfo[0]?.username);
    setBreadcrumbList(["Manage User", userInfo[0]?.username]);

    setAccountInfo({
      firstName: userInfo[0]?.profile?.firstName,
      lastName: userInfo[0]?.profile?.lastName,
      email: userInfo[0]?.profile?.email,
      facialScanImage: userInfo[0]?.facialScanImage,
    });

    setProfileInfo({
      profilePicture: userInfo[0]?.profile.photo,
      gender: userInfo[0]?.profile.gender,
      joinedDate: userInfo[0]?.profile.joinedDate
        ? new Date(userInfo[0]?.profile.joinedDate)
        : undefined,
      contactNumber: userInfo[0]?.profile.contactNumber,
      position: {
        value: userInfo[0]?.profile.position?.id,
        label: userInfo[0]?.profile.position?.name,
      },
      education: userInfo[0]?.profile.education,
      department: {
        value: userInfo[0]?.profile.department?.id,
        label: userInfo[0]?.profile.department?.name,
      },
      address: userInfo[0]?.profile.addresses?.map((address) => ({
        title: address.Title,
        address1: address.AddressLine1,
        city: address.City,
        state: address.State,
        postalCode: address.PostalCode,
        country: { value: address.Country, label: address.Country },
        timeZone: { value: address.TimeZone, label: address.TimeZone },
      })),
      certificate: userInfo[0]?.profile.certificateProfiles?.map((certi) => ({
        certification: {
          value: certi.certificate?.id,
          label: certi.certificate?.name,
        },
        expiryDate: certi.expirationDate
          ? new Date(certi.expirationDate)
          : undefined,
        issueDate: certi.issueDate ? new Date(certi.issueDate) : undefined,
        completionDate: certi.completionDate
          ? new Date(certi.completionDate)
          : undefined,
      })),
    });
  }, [userInfo]);

  const handleBreadcrumbClick = (index) => {
    index === 0 && router.push("/settings/manageUsers");
  };

  return (
    <>
      <CustomBreadcrumb
        title={userName}
        breadcrumbList={breadcrumbList}
        handleBreadcrumbClick={handleBreadcrumbClick}
        createbtn={true}
        createBtnText="Create User"
        handleCreate={() => router.push("/settings/manageUsers/create")}
      />
      <div className={styles.viewUserContainer}>
        <div className={commonStyles.formEditDetail}>
          <Link href={`/settings/manageUsers/edit/${params?.id}`}>
            <button>
              <GrEdit size={16} />
              Edit Details
            </button>
          </Link>
        </div>
        <div className={styles.accountInformationWrapper}>
          <AccountInformation view accountInfo={accountInfo} />
        </div>
        <div className={styles.profileInformationWrapper}>
          <ProfileInformation view profileInfo={profileInfo} />
        </div>
      </div>
    </>
  );
};

export default ViewUser;
