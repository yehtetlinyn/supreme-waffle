import React, { useEffect, useRef, useState } from "react";
import commonStyles from "../styles/commonStyles.module.css";
import styles from "./manageUser.module.css";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { Col, Collapse, Form, Label, Row } from "reactstrap";
import { LuImagePlus } from "react-icons/lu";
import SelectBox from "../selectBox";
import CustomDatePicker from "../certifications/assignUser/datePicker";
import AddressForm from "./addressForm";
import CertificateForm from "./certificateForm";
import Image from "next/image";
import usePositionStore from "@/store/position";
import useDepartmentStore from "@/store/department";
import Loading from "../modals/loading";

const defaultAddField = {
  title: "",
  address1: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
  timeZone: "",
};

const defaultCertiField = {
  certification: "",
  expiryDate: "",
  issueDate: "",
  completionDate: "",
};

const ProfileInformation = ({
  view,
  edit,
  profileInfo,
  setProfileInfo,
  siteUser,
  setCurrentTab,
}) => {
  const {
    positionInfo,
    getPositions,
    loading: positionLoading,
  } = usePositionStore((state) => ({
    positionInfo: state.positionInfo,
    getPositions: state.getPositions,
    loading: state.loading,
  }));
  const {
    departmentInfo,
    getDepartments,
    loading: departmentLoading,
  } = useDepartmentStore((state) => ({
    departmentInfo: state.departmentInfo,
    getDepartments: state.getDepartments,
    loading: state.loading,
  }));
  const methods = useForm();
  const joinedDateRef = useRef();
  const positionRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [positionOption, setPositionOption] = useState([]);
  const [departmentOption, setDepartmentOption] = useState([]);
  const profilePic = methods.watch("profilePicture");
  const watchJoinedDate = methods.watch("joinedDate");

  useEffect(() => {
    methods.reset({
      address: profileInfo?.address || [defaultAddField],
      certificate: profileInfo?.certificate || [defaultCertiField],
      gender: profileInfo?.gender || "Male",
      contactNumber: profileInfo?.contactNumber,
      department: profileInfo?.department,
      education: profileInfo?.education,
      joinedDate: profileInfo?.joinedDate,
      position: profileInfo?.position,
      profilePicture: profileInfo?.profilePicture,
    });
  }, [profileInfo]);

  //Manually set and clear the error of joined date
  useEffect(() => {
    if (methods.formState.dirtyFields.joinedDate) {
      watchJoinedDate
        ? methods.clearErrors("joinedDate")
        : methods.setError("joinedDate", {
            type: "required",
            message: "Please select Joined Date",
          });
    }
  }, [watchJoinedDate]);

  const fetchPositionData = async () => {
    console.log("fetching positions...");
    await getPositions({
      where: {
        deleted: false,
        limit: -1,
      },
    });
  };

  const fetchDepartmentData = async () => {
    console.log("feching deaprtments...");
    await getDepartments({
      where: {
        limit: -1,
      },
    });
  };

  //Fetch position data for position option
  useEffect(() => {
    fetchPositionData();
    fetchDepartmentData();
  }, []);

  useEffect(() => {
    if (positionInfo) {
      setPositionOption(
        positionInfo.map((position) => ({
          value: position.id,
          label: position.name,
        }))
      );
    }
    if (departmentInfo) {
      setDepartmentOption(
        departmentInfo.map((department) => ({
          value: department.id,
          label: department.name,
        }))
      );
    }
  }, [positionInfo, departmentInfo]);

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
          methods.setValue("profilePicture", imageFile);
        } else {
          setMessage("only images accepted");
        }
      }
    }
  };

  const submit = (data) => {
    setProfileInfo(data);
    setCurrentTab(3);
  };

  if (positionLoading && departmentLoading) {
    return <Loading />;
  } else {
    return (
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(submit)}
          className={commonStyles.formWrapper}
          style={{ gap: 20 }}
        >
          <div className={styles.accInfoContainer}>
            <Row className={commonStyles.formGroup}>
              <Col lg={6}>
                <Label className="mb-0">
                  {view ? "Profile Picture" : "Upload Profile Picture"}
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
                      siteUser && profilePic?.url
                        ? styles.siteUserImageDropArea
                        : isDragging
                        ? styles.imageDropAreaDragging
                        : styles.imageDropArea
                    }
                  >
                    {profilePic?.name ? (
                      profilePic?.url ? (
                        <Image
                          src={profilePic?.url}
                          alt="profilePicture"
                          width={150}
                          height={150}
                        />
                      ) : (
                        <Image
                          src={URL.createObjectURL(profilePic)}
                          alt="profilePicture"
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
                      control={methods.control}
                      name={"profilePicture"}
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
              <Col className="d-flex flex-column gap-4">
                <div>
                  <Label>
                    Gender <p className={commonStyles.errorText}>*</p>
                  </Label>
                  <div className={styles.radioSelectContainer}>
                    <div className={styles.radioSelector}>
                      <input
                        type="radio"
                        name="gender"
                        value="Male"
                        id="male"
                        disabled={view}
                        {...methods.register("gender")}
                      />
                      <label>Male</label>
                    </div>
                    <div className={styles.radioSelector}>
                      <input
                        type="radio"
                        name="gender"
                        value="Female"
                        id="female"
                        disabled={view}
                        {...methods.register("gender")}
                      />
                      <label>Female</label>
                    </div>
                  </div>
                </div>
                <div>
                  <Label>
                    Joined Date
                    {/* <p className={commonStyles.errorText}>*</p> */}
                  </Label>
                  <Controller
                    name="joinedDate"
                    control={methods.control}
                    // rules={{
                    //   required: "Please select Joined Date",
                    // }}
                    render={({ field: { onChange, value, name } }) => (
                      <CustomDatePicker
                        selectedDate={value}
                        onChange={onChange}
                        fieldName={name}
                        disabled={view}
                        arrow={false}
                        error={methods.formState.errors.joinedDate}
                      />
                    )}
                  />
                  {methods.formState.errors.joinedDate && (
                    <p className={commonStyles.errorText}>
                      {methods.formState.errors.joinedDate.message}
                    </p>
                  )}
                </div>
              </Col>
            </Row>
            <Row className={commonStyles.formGroup}>
              <Col className="d-flex flex-column ">
                <Label>
                  Contact Number <p className={commonStyles.errorText}>*</p>
                </Label>
                <input
                  type="text"
                  placeholder="Enter contact Number"
                  maxLength={15}
                  readOnly={view}
                  className={
                    methods.formState.errors.contactNumber
                      ? commonStyles.errorFormInputBox
                      : commonStyles.formInputBox
                  }
                  {...methods.register("contactNumber", {
                    required: "This field is require",
                  })}
                />
                {methods.formState.errors.contactNumber && (
                  <p className={commonStyles.errorText}>
                    {methods.formState.errors.contactNumber.message}
                  </p>
                )}
              </Col>
              <Col className="d-flex flex-column ">
                <Label>Department</Label>
                <Controller
                  name="department"
                  control={methods.control}
                  render={({ field: { onChange, name, value } }) => {
                    return (
                      <SelectBox
                        placeholder="Select department"
                        options={departmentOption}
                        onChange={onChange}
                        value={value}
                        crudForm
                        view={view}
                      />
                    );
                  }}
                />
              </Col>
            </Row>
            <Row className={commonStyles.formGroup}>
              <Col className="d-flex flex-column ">
                <Label>
                  Position
                  {/* <p className={commonStyles.errorText}>*</p> */}
                </Label>
                <Controller
                  name="position"
                  control={methods.control}
                  // rules={{
                  //   required: "Please select position",
                  // }}
                  render={({ field: { onChange, name, value } }) => {
                    return (
                      <SelectBox
                        placeholder="Select position"
                        options={positionOption}
                        onChange={onChange}
                        value={value}
                        crudForm
                        selectRef={positionRef}
                        formErrors={methods.formState.errors.position}
                        view={view}
                      />
                    );
                  }}
                />
                {methods.formState.errors.position && (
                  <p className={commonStyles.errorText}>
                    {methods.formState.errors.position.message}
                  </p>
                )}
              </Col>
              <Col className="d-flex flex-column ">
                <Label>Education</Label>
                <input
                  type="text"
                  placeholder="Enter education"
                  readOnly={view}
                  className={commonStyles.formInputBox}
                  {...methods.register("education")}
                />
              </Col>
            </Row>
            <Row className={commonStyles.formGroup}>
              <Col className="d-flex flex-column ">
                <Label>Address</Label>
                <AddressForm defaultAddField={defaultAddField} view={view} />
              </Col>
            </Row>
            <Row className={commonStyles.formGroup}>
              <Col className="d-flex flex-column ">
                <Label>Certificate</Label>
                <CertificateForm
                  defaultCertiField={defaultCertiField}
                  view={view}
                />
              </Col>
            </Row>
          </div>

          {!view && !edit && (
            <div className={styles.actionButtonContainer}>
              <button type="button" className={commonStyles.formCancelBtn}>
                Cancel
              </button>
              <button
                type="button"
                className={commonStyles.formCreateBtn}
                style={{ marginLeft: "auto" }}
                onClick={() => setCurrentTab(1)}
              >
                Back
              </button>
              <button type="submit" className={commonStyles.formCreateBtn}>
                Next
              </button>
            </div>
          )}
        </form>
      </FormProvider>
    );
  }
};

export default ProfileInformation;
