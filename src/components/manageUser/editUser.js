"use client";
import useUsersStore from "@/store/user";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import CustomBreadcrumb from "../manageLayout/breadcrumb";
import commonStyles from "../styles/commonStyles.module.css";
import styles from "./manageUser.module.css";
import EditAccountInformation from "./editAccountInformation";
import { FormProvider, useForm } from "react-hook-form";
import EditProfileInformation from "./editProfileInformation";
import { UPDATE_USER } from "@/graphql/mutations/user";
import { UPDATE_PROFILE } from "@/graphql/mutations/profile";
import apolloClient from "@/lib/apolloClient";
import { useMutation } from "@apollo/client";
import { uploadFile } from "@/utils/helpers";
import {
  CREATE_CERTIFICATE_PROFILE,
  DELETE_CERTIFICATE_PROFILE,
  UPDATE_CERTIFICATE_PROFILE,
} from "@/graphql/mutations/certificateProfile";
import dayjs from "dayjs";
import LeaveConfirmation from "../modals/leave";
import usePageStore from "@/store/pageStore";
import { shallow } from "zustand/shallow";

const defaultAddField = {
  address1: "",
  address2: "",
  city: "",
  state: "",
  postalCode: "",
  conuntry: "",
  timeZone: "",
};

const defaultCertiField = {
  id: "",
  certification: "",
  expiryDate: "",
  issueDate: "",
  completionDate: "",
};

const EditUser = () => {
  const router = useRouter();
  const params = useParams();
  const [userName, setUserName] = useState("");
  const [breadcrumbList, setBreadcrumbList] = useState([]);

  const { getUsers, userInfo, loading } = useUsersStore((state) => ({
    getUsers: state.getUsers,
    userInfo: state.userInfo,
    loading: state.loading,
  }));

  const {
    leaveModal: isLeaveModal,
    handleLeaveOpen,
    setIsFormDirty,
  } = usePageStore(
    (state) => ({
      leaveModal: state.leaveModal,
      handleLeaveOpen: state.handleLeaveOpen,
      setIsFormDirty: state.setIsFormDirty,
    }),
    shallow
  );

  const methods = useForm();

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

  useEffect(() => {
    //Set breadcrumb list
    setBreadcrumbList(["Manage User", userInfo[0]?.username]);
    setUserName(userInfo[0]?.username);

    //Set default values for the form fields
    methods.reset({
      address: userInfo[0]?.profile.addresses
        ? userInfo[0]?.profile.addresses?.map((add) => ({
            title: add.Title,
            address1: add.AddressLine1,
            city: add.City,
            state: add.State,
            postalCode: add.PostalCode,
            country: { value: add.Country, label: add.Country },
            timeZone: { value: add.TimeZone, label: add.TimeZone },
          }))
        : [defaultAddField],
      certificate: userInfo[0]?.profile.certificateProfiles
        ? userInfo[0]?.profile.certificateProfiles?.map((certi) => ({
            id: certi.id,
            certification: {
              value: certi.certificate.id,
              label: certi.certificate.name,
            },
            expiryDate: certi.expirationDate
              ? new Date(certi.expirationDate)
              : undefined,
            issueDate: certi.issueDate ? new Date(certi.issueDate) : undefined,
            completionDate: certi.completionDate
              ? new Date(certi.completionDate)
              : undefined,
          }))
        : [defaultCertiField],
      email: userInfo[0]?.profile?.email,
      facialScanImage: userInfo[0]?.facialScanImage,
      firstName: userInfo[0]?.profile?.firstName,
      lastName: userInfo[0]?.profile?.lastName,
      contactNumber: userInfo[0]?.profile.contactNumber,
      education: userInfo[0]?.profile.education,
      gender: userInfo[0]?.profile.gender,
      profilePicture: userInfo[0]?.profile.photo,
      joinedDate: userInfo[0]?.profile.joinedDate
        ? new Date(userInfo[0]?.profile.joinedDate)
        : undefined,
      department: userInfo[0]?.profile.department
        ? {
            value: userInfo[0]?.profile.department.id,
            label: userInfo[0]?.profile.department.name,
          }
        : "",
      position: userInfo[0]?.profile.position
        ? {
            value: userInfo[0]?.profile.position.id,
            label: userInfo[0]?.profile.position.name,
          }
        : "",
    });
  }, [userInfo]);

  const handleBreadcrumbClick = (index) => {
    methods.formState.isDirty
      ? handleLeaveOpen(true)
      : router.push("/settings/manageUsers");
  };

  //Set global dirty state accordingly to local state changes
  useEffect(() => {
    setIsFormDirty(methods.formState.isDirty);
  }, [methods.formState.isDirty]);

  const [updateAccountInfoAction] = useMutation(UPDATE_USER, {
    client: apolloClient,
    onCompleted: (data) => {},
    onError: (error) => {
      console.log("error", error);
    },
  });

  const [updateProfileInfoAction] = useMutation(UPDATE_PROFILE, {
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

  const [updateCertificateProfileAction, { loading: updateLoading }] =
    useMutation(UPDATE_CERTIFICATE_PROFILE, {
      client: apolloClient,
      onCompleted: (data) => {},
      onError: (error) => console.log(error),
    });

  const [deleteCertificateAction, { loading: deleteLoading }] = useMutation(
    DELETE_CERTIFICATE_PROFILE,
    {
      client: apolloClient,
      onCompleted: (data) => {},
      onError: (error) => console.log(error),
    }
  );

  const formatCreateDate = (date) => {
    if (date) {
      return dayjs(date).format("YYYY-MM-DD");
    } else {
      return null;
    }
  };

  const updateAccInfo = async (facialImgId, submittedData) => {
    //Then create account info first to relate with profile info
    const data = await updateAccountInfoAction({
      variables: {
        id: parseFloat(params.id),
        data: {
          username: submittedData.firstName + " " + submittedData.lastName,
          email: submittedData.email,
          role: 1,
          facialScanImage: facialImgId || undefined,
        },
      },
    });
    return data;
  };

  const updateProfileInfo = async (
    profileImgId,
    accData,
    submittedData,
    addresses
  ) => {
    const data = await updateProfileInfoAction({
      variables: {
        id: accData.data?.updateUsersPermissionsUser.data.attributes.profile
          ?.data?.id,
        data: {
          addresses: addresses,
          contactNumber: submittedData.contactNumber,
          department: submittedData.department?.value,
          education: submittedData.education,
          gender: submittedData.gender,
          joinedDate: formatCreateDate(submittedData.joinedDate),
          position: submittedData.position?.value,
          fullName:
            accData.data?.updateUsersPermissionsUser.data.attributes.username,
          firstName: submittedData.firstName,
          lastName: submittedData.lastName,
          photo: profileImgId ? profileImgId : undefined,
          email: submittedData.email,
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
              profiles: profileData?.data?.updateProfile.data.id,
            },
          },
        });
      })
    );
  };

  const updateCertificateProfile = async (updatedCertificates) => {
    await Promise.all(
      updatedCertificates?.map(async (certi) => {
        await updateCertificateProfileAction({
          variables: {
            id: certi.id,
            data: {
              certificate: certi.certification?.value,
              completionDate: formatCreateDate(certi.completionDate),
              issueDate: formatCreateDate(certi.issueDate),
              expirationDate: formatCreateDate(certi.expiryDate),
            },
          },
        });
      })
    );
  };

  const deleteCertificateProfile = async (deletedCertificates) => {
    await Promise.all(
      deletedCertificates?.map(async (certi) => {
        await deleteCertificateAction({
          variables: {
            id: certi.id,
          },
        });
      })
    );
  };

  const submit = async (submittedData) => {
    // Prepare for addresses field array
    const addresses = submittedData.address?.map((add) => {
      return {
        Title: add.title,
        AddressLine1: add.address1,
        City: add.city,
        State: add.state,
        PostalCode: add.postalCode,
        Country: add.country?.value,
        TimeZone: add.timeZone?.value,
      };
    });

    //Separate the new added and updated certificateProfile lists
    const newAddCertificates = submittedData.certificate?.filter(
      (certi) => !certi.id
    );
    const updatedCertificates = submittedData.certificate?.filter(
      (certi) => certi.id
    );
    const deletedCertificates = userInfo[0].profile.certificateProfiles?.filter(
      (prevCerti) =>
        !submittedData.certificate?.some(
          (submittedCerti) => submittedCerti.id === prevCerti.id
        )
    );

    const [facialImgId, profileImgId] = await Promise.all([
      submittedData.facialScanImage?.id ||
        (await uploadFile(submittedData.facialScanImage)),
      submittedData.profilePicture?.id ||
        (await uploadFile(submittedData.profilePicture)),
    ]);

    const uploadedAccData = await updateAccInfo(facialImgId, submittedData);
    const uploadedProfileData = await updateProfileInfo(
      profileImgId,
      uploadedAccData,
      submittedData,
      addresses
    );

    if (newAddCertificates?.length > 0) {
      createCertificateProfile(newAddCertificates, uploadedProfileData);
    }

    if (updatedCertificates?.length > 0) {
      updateCertificateProfile(updatedCertificates);
    }

    if (deletedCertificates?.length > 0) {
      deleteCertificateProfile(deletedCertificates);
    }

    router.push("/settings/manageUsers");
  };

  if (!loading) {
    return (
      <>
        {isLeaveModal && (
          <LeaveConfirmation
            isOpen={isLeaveModal}
            toggle={() => handleLeaveOpen(false)}
          />
        )}
        <CustomBreadcrumb
          title={userName}
          breadcrumbList={breadcrumbList}
          handleBreadcrumbClick={handleBreadcrumbClick}
          createbtn={true}
          createBtnText="Create User"
          handleCreate={() => router.push("/settings/manageUsers/create")}
        />
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(submit)}
            className={commonStyles.formWrapper}
            style={{ gap: 20 }}
          >
            <div className={styles.editUserContainer}>
              <div className={styles.accountInformationWrapper}>
                <EditAccountInformation userInfo={userInfo} />
              </div>
              <div className={styles.profileInformationWrapper}>
                <EditProfileInformation
                  defaultAddField={defaultAddField}
                  defaultCertiField={defaultCertiField}
                />
              </div>
            </div>
            <div className={styles.actionButtonContainer}>
              <button
                type="button"
                className={commonStyles.formCancelBtn}
                onClick={() => {
                  methods.formState.isDirty
                    ? handleBreadcrumbClick(true)
                    : router.push("/settings/manageUsers");
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={commonStyles.formCreateBtn}
                style={{ marginLeft: "auto" }}
              >
                Save Changes
              </button>
            </div>
          </form>
        </FormProvider>
      </>
    );
  }
};

export default EditUser;
