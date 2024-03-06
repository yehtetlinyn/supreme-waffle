"use client";
import React, { useState } from "react";
import CustomBreadcrumb from "../manageLayout/breadcrumb";
import { useRouter } from "next/navigation";
import styles from "./manageUser.module.css";
import ManageUserTabBtn from "./tabButton";
import useUsersStore from "@/store/user";
import UploadUserList from "./uploadUserList";
import SelectUser from "./selectUser";
import ConfirmDetail from "./confirmDetail";
import AccountInformation from "./accountInformation";
import ProfileInformation from "./profileInformation";
import ReviewAndSubmit from "./reviewAndSubmit";
import { useMutation } from "@apollo/client";
import { CREATE_USERS } from "@/graphql/mutations/user";
import apolloClient from "@/lib/apolloClient";
import { CREATE_PROFILE } from "@/graphql/mutations/profile";
import { uploadFile } from "@/utils/helpers";
import dayjs from "dayjs";
import { CREATE_CERTIFICATE_PROFILE } from "@/graphql/mutations/certificateProfile";
import UploadUserSuccess from "../modals/uploadUserSuccess";
import ConfirmationModal from "../modals/confirmation";

const CreateNewUser = () => {
  const router = useRouter();
  const breadcrumbList = ["Users", "Create New User"];

  const [accountInfo, setAccountInfo] = useState(null);
  const [profileInfo, setProfileInfo] = useState(null);
  const [isAccInfoDirty, setIsAccInfoDirty] = useState(false);

  const [zipFileContent, setZipFileContent] = useState(null);
  const [uploadedUsers, setUploadedUsers] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const [currentTab, setCurrentTab] = useState(1);
  const [createType, setCreateType] = useState("multiple");

  //set require states for success modal
  const [successModal, setSuccessModal] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [uploadType, setUploadType] = useState("");
  const [userDetail, setUserDetail] = useState({});

  const handleTypeChange = (type) => {
    if (type === "individual") {
      if (zipFileContent || currentTab > 1) {
        setConfirmationOpen(true);
      } else {
        setCreateType(type);
      }
    } else if (type === "multiple") {
      if (isAccInfoDirty || currentTab > 1) {
        setConfirmationOpen(true);
      } else {
        setCreateType(type);
      }
    }
  };

  const handleConfirmClick = () => {
    setZipFileContent(null);
    setUploadedUsers(null);
    setSelectedUsers([]);
    setAccountInfo(null);
    setProfileInfo(null);
    setIsAccInfoDirty(false);
    setCurrentTab(1);
    setCreateType((prev) => (prev === "multiple" ? "individual" : "multiple"));
    setConfirmationOpen(false);
  };

  const handleBreadcrumbClick = (breadcrumbNum) => {
    breadcrumbNum === 0 && router.push("/settings/manageUsers");
  };

  const [createAccountInfoAction] = useMutation(CREATE_USERS, {
    client: apolloClient,
    onCompleted: (data) => {},
    onError: (error) => {
      console.log("error", error);
    },
  });

  const [createProfileInfoAction] = useMutation(CREATE_PROFILE, {
    client: apolloClient,
    onCompleted: (data) => {},
    onError: (error) => {
      console.log("error", error);
    },
  });

  const [createCertificateProfileAction, { loading: createLoading }] =
    useMutation(CREATE_CERTIFICATE_PROFILE, {
      client: apolloClient,
      onCompleted: (data) => {},
      onError: (error) => console.log(error),
    });

  const formatCreateDate = (date) => {
    if (date) {
      return dayjs(date).format("YYYY-MM-DD");
    } else {
      return null;
    }
  };

  const createAccInfo = async (facialImgId, submittedData) => {
    //Then create account info first to relate with profile info
    const data = await createAccountInfoAction({
      variables: {
        data: {
          username: submittedData.firstName + " " + submittedData.lastName,
          email: submittedData.email,
          //Setting the password with fixed value.
          //When the password generating format is confirm, need to update this.
          password: "password",
          role: 3,
          facialScanImage: facialImgId || undefined,
        },
      },
    });
    return data;
  };

  const createProfileInfo = async (
    profileImgId,
    accData,
    accountInfo,
    submittedData,
    addresses
  ) => {
    const data = await createProfileInfoAction({
      variables: {
        data: {
          user: accData.data?.createUsersPermissionsUser.data.id,
          addresses: addresses,
          contactNumber: submittedData.contactNumber,
          department: submittedData.department?.value,
          education: submittedData.education,
          gender: submittedData.gender,
          joinedDate: formatCreateDate(submittedData.joinedDate),
          position: submittedData.position?.value,
          fullName:
            accData.data?.createUsersPermissionsUser.data.attributes.username,
          photo: profileImgId || undefined,

          firstName: accountInfo.firstName,
          lastName: accountInfo.lastName,
          email: accountInfo.email,

          //These fields must default in BE
          //When the BE update released, need to remove these.
          privacy: "Private",
          status: "Available",
        },
      },
    });
    return data;
  };

  const createCertificateProfile = async (newAddCertificates, profileData) => {
    await Promise.all(
      newAddCertificates?.map(async (certi) => {
        await createCertificateProfileAction({
          variables: {
            data: {
              certificate: certi.certification?.value,
              completionDate: formatCreateDate(certi.completionDate),
              issueDate: formatCreateDate(certi.issueDate),
              expirationDate: formatCreateDate(certi.expiryDate),
              profiles: profileData?.data?.createProfile.data.id,
            },
          },
        });
      })
    );
  };

  const createIndividualUser = async () => {
    console.log("accinfo", accountInfo);
    console.log("profile", profileInfo);
    //Prepare for addresses field array
    const addresses = profileInfo.address?.map((add) => {
      return {
        Title: add.title,
        AddressLine1: add.address1,
        City: add.city,
        State: add.state,
        PostalCode: add.postalCode,
        Country: add.country.value,
        TimeZone: add.timeZone.value,
      };
    });

    const [facialImgId, profileImgId] = await Promise.all([
      await uploadFile(accountInfo.facialScanImage),
      await uploadFile(profileInfo.profilePicture),
    ]);

    const uploadedAccData = await createAccInfo(facialImgId, accountInfo);
    const uploadedProfileData = await createProfileInfo(
      profileImgId,
      uploadedAccData,
      accountInfo,
      profileInfo,
      addresses
    );

    if (profileInfo.certificate?.length > 0) {
      createCertificateProfile(profileInfo.certificate, uploadedProfileData);
    }

    console.log("accdata", uploadedAccData);
    console.log("profiledata", uploadedProfileData);

    setUserDetail({
      userId: uploadedAccData.data?.createUsersPermissionsUser.data?.id,
      userName:
        uploadedProfileData?.data?.createProfile.data?.attributes.fullName,
      email:
        uploadedAccData.data?.createUsersPermissionsUser.data?.attributes.email,
    });
    setUploadType("individual");
    setSuccessModal(true);
  };

  const createImportedUser = async () => {
    try {
      await Promise.all(
        selectedUsers.map(async (user) => {
          const accData = await createAccountInfoAction({
            variables: {
              data: {
                username: user.first_name.trim() + " " + user.last_name.trim(),
                email: user.email,
                facialScanImage: user.image_id,
                //Setting the password with fixed value.
                //When the password generating format is confirm, need to update this.
                password: "password",
                role: 3,
              },
            },
          });
          const profileData = await createProfileInfoAction({
            variables: {
              data: {
                user: accData.data?.createUsersPermissionsUser.data.id,
                fullName:
                  accData.data?.createUsersPermissionsUser.data.attributes
                    .username,
                firstName: user.first_name.trim(),
                lastName: user.last_name.trim(),
                email: user.email,
                gender: user.gender,
                contactNumber: user.contact_number,
              },
            },
          });
        })
      );
      // router.push("/settings/manageUsers");
      setUserDetail({ count: selectedUsers?.length });
      setUploadType("multiple");
      setSuccessModal(true);
    } catch (error) {
      console.log("error", error);
    }
  };

  const submit = async (submitType) => {
    if (submitType === "addNewUser") {
      createIndividualUser();
    } else if (submitType === "importUsers") {
      createImportedUser();
    }
  };

  return (
    <>
      {successModal && (
        <UploadUserSuccess
          isOpen={successModal}
          toggle={() => setSuccessModal(false)}
          uploadType={uploadType}
          userDetail={userDetail}
          handleViewAllUsersClick={() => router.push("/settings/manageUsers")}
        />
      )}
      {confirmationOpen && (
        <ConfirmationModal
          isOpen={confirmationOpen}
          toggle={() => setConfirmationOpen(!confirmationOpen)}
          modalTitle={"Confirmation Message"}
          modalMsg={
            "Proceeding to another create type will result in the loss of your current data. Do you wish to continue?"
          }
          handleClick={() => handleConfirmClick()}
        />
      )}
      <CustomBreadcrumb
        title={"Users"}
        breadcrumbList={breadcrumbList}
        handleBreadcrumbClick={handleBreadcrumbClick}
      />
      <div className={styles.createSelectContainer}>
        <p style={{ fontSize: 14, fontWeight: 400 }}>
          Please choose what you want to create first
        </p>
        <div className={styles.radioSelectContainer}>
          <label className={styles.radioSelector}>
            <input
              type="radio"
              checked={createType === "multiple"}
              onChange={() => handleTypeChange("multiple")}
            />
            <span>Import users</span>
          </label>
          <label className={styles.radioSelector}>
            <input
              type="radio"
              checked={createType === "individual"}
              onChange={() => handleTypeChange("individual")}
            />
            <span>Add new users</span>
          </label>
        </div>
      </div>
      <ManageUserTabBtn
        setCurrentTab={setCurrentTab}
        currentTab={currentTab}
        createType={createType}
      />
      {createType === "multiple" ? (
        currentTab === 1 ? (
          <UploadUserList
            setCurrentTab={setCurrentTab}
            setUploadedUsers={setUploadedUsers}
            zipFileContent={zipFileContent}
            setZipFileContent={setZipFileContent}
          />
        ) : currentTab === 2 ? (
          <SelectUser
            setCurrentTab={setCurrentTab}
            uploadedUsers={uploadedUsers}
            selectedUsers={selectedUsers}
            setSelectedUsers={setSelectedUsers}
          />
        ) : (
          <ConfirmDetail
            setCurrentTab={setCurrentTab}
            selectedUsers={selectedUsers}
            submit={submit}
          />
        )
      ) : currentTab === 1 ? (
        <AccountInformation
          accountInfo={accountInfo}
          setAccountInfo={setAccountInfo}
          setCurrentTab={setCurrentTab}
          setIsAccInfoDirty={setIsAccInfoDirty}
        />
      ) : currentTab === 2 ? (
        <ProfileInformation
          profileInfo={profileInfo}
          setProfileInfo={setProfileInfo}
          setCurrentTab={setCurrentTab}
        />
      ) : (
        <ReviewAndSubmit
          accountInfo={accountInfo}
          profileInfo={profileInfo}
          submit={submit}
          setCurrentTab={setCurrentTab}
        />
      )}
    </>
  );
};

export default CreateNewUser;
