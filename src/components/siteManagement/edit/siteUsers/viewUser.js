"use client";
import React from "react";
import CustomBreadcrumb from "@/components/manageLayout/breadcrumb";
import AccountInformation from "@/components/manageUser/accountInformation";
import ProfileInformation from "@/components/manageUser/profileInformation";
import styles from "@/components/manageUser/manageUser.module.css";

const ViewUser = ({ selectedUserData, toggleViewUserPage }) => {
  const {
    user,
    photo,
    gender,
    joinedDate,
    contactNumber,
    position,
    education,
    addresses,
    certificateProfiles,
    department,
  } = selectedUserData;
  const breadcrumbList = ["Users", `${selectedUserData?.fullName}`];
  const accountInfo = {
    firstName: user?.data?.attributes?.firstName,
    lastName: user?.data?.attributes?.lastName,
    email: user?.data?.attributes?.email,
    facialScanImage: {
      url: user?.data?.attributes?.facialScanImage?.data?.attributes?.url,
      name: user?.data?.attributes?.facialScanImage?.data?.attributes?.name,
    },
  };

  const profileInfo = {
    profilePicture: {
      url: photo?.data?.attributes?.url,
      name: photo?.data?.attributes?.name,
    },
    gender: gender,
    joinedDate: joinedDate ? new Date(joinedDate) : undefined,
    contactNumber: contactNumber,
    position: {
      value: position?.id,
      label: position?.attributes?.name,
    },

    education: education,
    department: {
      value: department?.id,
      label: department?.attributes?.name,
    },
    address: addresses.map((address) => ({
      address1: address?.AddressLine1,
      address2: address?.AddressLine2,
      city: address?.City,
      state: address?.State,
      postalCode: address?.PostalCode,
      country: { value: address?.Country, label: address?.Country },
      timeZone: { value: address?.TimeZone, label: address?.TimeZone },
    })),
    certificate: certificateProfiles?.data?.map((certi) => ({
      certification: {
        value: certi?.attributes?.certificate?.data?.id,
        label: certi?.attributes?.certificate?.data?.attributes?.name,
      },
      expiryDate: certi?.attributes?.expirationDate
        ? new Date(certi?.attributes?.expirationDate)
        : undefined,
      issueDate: certi?.attributes?.issueDate
        ? new Date(certi?.attributes?.issueDate)
        : undefined,
      completionDate: certi?.attributes?.completionDate
        ? new Date(certi?.attributes?.completionDate)
        : undefined,
    })),
  };

  const handleBreadcrumbClick = (breadcrumbIndex) => {
    if (breadcrumbIndex === 0) {
      toggleViewUserPage();
    }
  };
  return (
    <>
      <div className={styles.viewUserContainer}>
        <CustomBreadcrumb
          breadcrumbList={breadcrumbList}
          handleBreadcrumbClick={handleBreadcrumbClick}
          siteUser
        />
        <div className={styles.accountInformationWrapper}>
          <AccountInformation view accountInfo={accountInfo} siteUser />
        </div>
        <div className={styles.profileInformationWrapper}>
          <ProfileInformation view profileInfo={profileInfo} siteUser />
        </div>
      </div>
    </>
  );
};

export default ViewUser;
