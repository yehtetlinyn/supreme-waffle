import React, { useEffect, useState } from "react";
import commonStyles from "../styles/commonStyles.module.css";
import styles from "./manageUser.module.css";
import useUsersStore from "@/store/user";
import {
  Controller,
  useFieldArray,
  useForm,
  useFormContext,
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

const EditProfileInformation = ({ defaultAddField, defaultCertiField }) => {
  const {
    view,
    register,
    control,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useFormContext();
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
  const [isDragging, setIsDragging] = useState(false);
  const [positionOption, setPositionOption] = useState([]);
  const [departmentOption, setDepartmentOption] = useState([]);
  const profilePic = watch("profilePicture");

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
      where: {},
    });
  };

  //Fetch position data for position option
  useEffect(() => {
    if (!view) {
      fetchPositionData();
      fetchDepartmentData();
    }
  }, []);

  //Set option lists
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

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    if (view) {
      const imageFile = event.dataTransfer.files[0];
      if (imageFile) {
        const fileType = imageFile["type"];
        const validImageTypes = ["image/jpeg", "image/png"];
        if (validImageTypes.includes(fileType)) {
          setValue("profilePicture", imageFile);
        } else {
        }
      }
    }
  };

  return (
    <div style={{ padding: "30px 15px" }}>
      <div className={styles.accInfoContainer}>
        <Row className={commonStyles.formGroup}>
          <Col lg={6}>
            <Label>
              Upload Profile Picture
              <span>(File formats:jpg, png , Max file size: 25 MB)</span>
            </Label>
            <div
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onDragOver={handleOnDragOver}
            >
              <Label
                className={
                  isDragging
                    ? styles.imageDropAreaDragging
                    : styles.imageDropArea
                }
              >
                {profilePic?.name ? (
                  profilePic.url ? (
                    <Image
                      src={profilePic.url}
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
                  control={control}
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
          <Col className="d-flex flex-column justify-content-between">
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
                    {...register("gender")}
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
                    {...register("gender")}
                  />
                  <label>Female</label>
                </div>
              </div>
            </div>
            <div>
              <Label>Joined Date</Label>
              <Controller
                name="joinedDate"
                control={control}
                render={({ field }) => (
                  <CustomDatePicker
                    selectedDate={field.value}
                    onChange={(date) => field.onChange(date)}
                    fieldName={field.name}
                    disabled={view}
                  />
                )}
              />
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
                errors.contactNumber
                  ? commonStyles.errorFormInputBox
                  : commonStyles.formInputBox
              }
              {...register("contactNumber")}
            />
            {errors.contactNumber && (
              <p className={commonStyles.errorText}>
                {errors.contactNumber.message}
              </p>
            )}
          </Col>
          <Col className="d-flex flex-column ">
            <Label>Department</Label>
            <Controller
              name="department"
              control={control}
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
            <Label>Position</Label>
            <Controller
              name="position"
              control={control}
              render={({ field: { onChange, name, value } }) => {
                return (
                  <SelectBox
                    placeholder="Select position"
                    options={positionOption}
                    onChange={onChange}
                    value={value}
                    crudForm
                    view={view}
                  />
                );
              }}
            />
          </Col>
          <Col className="d-flex flex-column ">
            <Label>Education</Label>
            <input
              type="text"
              placeholder="Enter education"
              readOnly={view}
              className={commonStyles.formInputBox}
              {...register("education")}
            />
          </Col>
        </Row>
        <Row className={commonStyles.formGroup}>
          <Col className="d-flex flex-column ">
            <Label>Address</Label>
            <AddressForm
              register={register}
              control={control}
              defaultAddField={defaultAddField}
              view={view}
              watch={watch}
              getValues={getValues}
            />
          </Col>
        </Row>
        <Row className={commonStyles.formGroup}>
          <Col className="d-flex flex-column ">
            <Label>Certificate</Label>
            <CertificateForm
              register={register}
              control={control}
              defaultCertiField={defaultCertiField}
              view={view}
              watch={watch}
              getValues={getValues}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default EditProfileInformation;
