import React, { useEffect, useState } from "react";
import commonStyles from "../styles/commonStyles.module.css";
import styles from "./manageUser.module.css";
import { Controller, useForm, useFormContext } from "react-hook-form";
import { Col, Form, Label, Row } from "reactstrap";
import { LuImagePlus } from "react-icons/lu";
import Image from "next/image";

const EditAccountInformation = () => {
  const {
    view,
    register,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const [isDragging, setIsDragging] = useState(false);

  const facialImage = watch("facialScanImage");

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

  return (
    <div style={{ padding: "30px 15px" }}>
      <div className={styles.accInfoContainer}>
        <Row className={commonStyles.formGroup}>
          <Col lg={6}>
            <Label>
              Facial Scan Image
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
                {facialImage?.name ? (
                  facialImage.url ? (
                    <Image
                      src={`${facialImage.url}`}
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
                          // setImage(e.target.files[0]);
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
              className={commonStyles.formInputBox}
              {...register("lastName")}
            />
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
              readOnly={true}
              className={
                errors.firstName
                  ? commonStyles.errorFormInputBox
                  : commonStyles.formInputBox
              }
              {...register("email", {
                required: "This field is required",
              })}
            />
            {errors.email && (
              <p className={commonStyles.errorText}>{errors.email.message}</p>
            )}
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default EditAccountInformation;
