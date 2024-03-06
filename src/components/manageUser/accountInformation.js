import React, { useEffect, useState } from "react";
import commonStyles from "../styles/commonStyles.module.css";
import styles from "./manageUser.module.css";
import useUsersStore from "@/store/user";
import { Controller, useForm } from "react-hook-form";
import { Col, Form, Label, Row } from "reactstrap";
import { LuImagePlus } from "react-icons/lu";
import Image from "next/image";
import Loading from "../modals/loading";

const AccountInformation = ({
  view,
  edit,
  accountInfo,
  setAccountInfo,
  siteUser = false,
  setCurrentTab,
  setIsAccInfoDirty,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    clearErrors,
    formState: { isValid, errors, isDirty, touchedFields },
  } = useForm({
    defaultValues: {
      facialScanImage: "",
      firstName: "",
      lastName: "",
      email: "",
    },
  });
  const [isDragging, setIsDragging] = useState(false);
  const facialImage = watch("facialScanImage");
  const watchLastName = watch("lastName");

  //Pass dirty property to parent component
  useEffect(() => {
    if (!view && !edit) {
      if (isDirty || facialImage) {
        setIsAccInfoDirty(true);
      } else {
        setIsAccInfoDirty(false);
      }
    }
  }, [isDirty, facialImage]);

  const {
    getUsers,
    userInfo,
    loading: userInfoLoading,
  } = useUsersStore((state) => ({
    getUsers: state.getUsers,
    userInfo: state.userInfo,
    loading: state.loading,
  }));

  const fetchUserData = async () => {
    await getUsers({
      where: {
        pageSize: 10000,
      },
    });
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  //Set initial values
  useEffect(() => {
    if (accountInfo) {
      setValue("email", accountInfo.email);
      setValue("facialScanImage", accountInfo.facialScanImage);
      setValue("firstName", accountInfo.firstName);
      setValue("lastName", accountInfo.lastName);
    }
  }, [accountInfo]);

  const handleDragEnter = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleOnDragOver = (event) => {
    event.preventDefault();
  };

  const [message, setMessage] = useState();
  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    if (!view) {
      const imageFile = event.dataTransfer.files[0];
      if (imageFile) {
        const fileType = imageFile["type"];
        const validImageTypes = ["image/jpeg", "image/png"];
        if (validImageTypes.includes(fileType)) {
          setValue("facialScanImage", imageFile);
        } else {
          setMessage("only images accepted");
        }
      }
    }
  };

  const submit = (data) => {
    setAccountInfo(data);
    setCurrentTab(2);
  };

  if (userInfoLoading) {
    return (
      <div>
        <Loading />
      </div>
    );
  } else {
    return (
      <form
        onSubmit={handleSubmit(submit)}
        className={commonStyles.formWrapper}
      >
        <div className={styles.accInfoContainer}>
          <Row className={commonStyles.formGroup}>
            <Col lg={6}>
              <Label>
                Facial Scan Image
                {!view && (
                  <span>(File formats:jpg, png , Max file size: 25 MB)</span>
                )}
              </Label>
              <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onDragOver={handleOnDragOver}
              >
                <Label
                  className={
                    siteUser && facialImage?.url
                      ? styles.siteUserImageDropArea
                      : isDragging
                      ? styles.imageDropAreaDragging
                      : styles.imageDropArea
                  }
                >
                  {facialImage?.name ? (
                    facialImage?.url ? (
                      <Image
                        src={facialImage?.url}
                        alt="facialScanImage"
                        width={150}
                        height={150}
                      />
                    ) : (
                      <Image
                        src={URL.createObjectURL(facialImage)}
                        alt="facialScanImage"
                        width={150}
                        height={150}
                      />
                    )
                  ) : (
                    <>
                      <LuImagePlus size={40} />
                      Click to add an asset or drag and drop one in this area
                    </>
                  )}
                  <Controller
                    control={control}
                    name={"facialScanImage"}
                    render={({ field: { value, onChange, ...field } }) => {
                      return (
                        <input
                          {...field}
                          value={value?.fileName}
                          type="file"
                          accept=".jpg, .png"
                          disabled={view}
                          onChange={(e) => {
                            onChange(e.target.files[0]);
                          }}
                        />
                      );
                    }}
                  />
                </Label>
              </div>
            </Col>
          </Row>
          <Row className={commonStyles.formGroup}>
            <Col className="d-flex flex-column ">
              <Label>
                First Name <p className={commonStyles.errorText}>*</p>
              </Label>
              <input
                type="text"
                placeholder="Enter first name"
                readOnly={view}
                className={
                  errors.firstName
                    ? commonStyles.errorFormInputBox
                    : commonStyles.formInputBox
                }
                {...register("firstName", {
                  required: "This field is required",
                  validate: (value) =>
                    userInfo?.filter(
                      (user) =>
                        user.username.trim() ===
                        (value + " " + watchLastName).trim()
                    ).length === 0 || "Already registered",
                })}
              />
              {errors.firstName && (
                <p className={commonStyles.errorText}>
                  {errors.firstName.message}
                </p>
              )}
            </Col>
            <Col className="d-flex flex-column ">
              <Label>
                Last Name <p className={commonStyles.errorText}>*</p>
              </Label>
              <input
                type="text"
                placeholder="Enter last name"
                readOnly={view}
                className={
                  errors.lastName
                    ? commonStyles.errorFormInputBox
                    : commonStyles.formInputBox
                }
                {...register("lastName", {
                  required: "This field is required",
                })}
              />
              {errors.lastName && (
                <p className={commonStyles.errorText}>
                  {errors.lastName.message}
                </p>
              )}
            </Col>
          </Row>
          <Row className={commonStyles.formGroup}>
            <Col className="d-flex flex-column col-6 ">
              <Label>
                Email <p className={commonStyles.errorText}>*</p>
              </Label>
              <input
                type="text"
                placeholder="Enter email"
                readOnly={view}
                className={
                  errors.email
                    ? commonStyles.errorFormInputBox
                    : commonStyles.formInputBox
                }
                {...register("email", {
                  required: "This field is required",
                  validate: (value) =>
                    userInfo?.filter(
                      (user) => user.email.trim() === value.trim()
                    ).length === 0 || "Already registered",
                })}
              />
              {errors.email && (
                <p className={commonStyles.errorText}>{errors.email.message}</p>
              )}
            </Col>
          </Row>
        </div>

        {!view && !edit && (
          <div className={styles.actionButtonContainer}>
            <button type="button" className={commonStyles.formCancelBtn}>
              Cancel
            </button>
            <button
              type="submit"
              className={commonStyles.formCreateBtn}
              style={{ marginLeft: "auto" }}
              //   onClick={() => submit}
            >
              Next
            </button>
          </div>
        )}
      </form>
    );
  }
};

export default AccountInformation;
