import React from "react";
import { useFormContext } from "react-hook-form";

import commonStyles from "../../styles/commonStyles.module.css";
import styles from "../project.module.css";
import { Col, Label, Row } from "reactstrap";

const CustomerForm = ({ viewMode }) => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <>
      <Row className={commonStyles.formGroup}>
        <Col className="d-flex flex-column ">
          <Label>
            First Name <p className={commonStyles.errorText}>*</p>
          </Label>
          <input
            type="text"
            placeholder="Enter first name"
            readOnly={viewMode}
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
            <p className={commonStyles.errorText}>{errors.firstName.message}</p>
          )}
        </Col>
        <Col className="d-flex flex-column ">
          <Label>
            Last Name <p className={commonStyles.errorText}>*</p>
          </Label>
          <input
            type="text"
            placeholder="Enter last name"
            readOnly={viewMode}
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
            <p className={commonStyles.errorText}>{errors.lastName.message}</p>
          )}
        </Col>
      </Row>
      <Row className={commonStyles.formGroup}>
        <Col className="d-flex flex-column ">
          <Label>
            Email <p className={commonStyles.errorText}>*</p>
          </Label>
          <input
            type="text"
            placeholder="Enter email address"
            readOnly={viewMode}
            className={
              errors.email
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
        <Col className="d-flex flex-column ">
          <Label>
            Contact No. <p className={commonStyles.errorText}>*</p>
          </Label>
          <input
            type="text"
            placeholder="Enter contact number"
            readOnly={viewMode}
            className={
              errors.contactNumber
                ? commonStyles.errorFormInputBox
                : commonStyles.formInputBox
            }
            {...register("contactNumber", {
              required: "This field is required",
            })}
          />
          {errors.contactNumber && (
            <p className={commonStyles.errorText}>
              {errors.contactNumber.message}
            </p>
          )}
        </Col>
      </Row>
    </>
  );
};

export default CustomerForm;
