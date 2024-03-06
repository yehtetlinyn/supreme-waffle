"use client";
import React, { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { Col, Label, Row } from "reactstrap";
import { useParams, useRouter } from "next/navigation";

import commonStyles from "../../styles/commonStyles.module.css";
import CustomDatePicker from "./datePicker";
import AssignUsersDropdown from "./customDropdown";
import usePageStore from "@/store/pageStore";
import { shallow } from "zustand/shallow";
import useProfileStore from "@/store/profile";
import Loading from "@/components/modals/loading";

const AssignUserForm = ({ submit, certificateProfiles, setRedirectLink }) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm();
  const router = useRouter();
  const params = useParams();

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

  const {
    getProfiles,
    profileInfo,
    loading: profileLoading,
  } = useProfileStore((state) => state);

  useMemo(() => {
    isDirty ? setIsFormDirty(true) : setIsFormDirty(isDirty);
  }, [isDirty]);

  useEffect(() => {
    if (certificateProfiles) {
      reset({
        expiryDate: certificateProfiles?.expirationDate
          ? new Date(certificateProfiles?.expirationDate)
          : "",
        issueDate: certificateProfiles?.issueDate
          ? new Date(certificateProfiles?.issueDate)
          : "",
        completionDate: certificateProfiles?.completionDate
          ? new Date(certificateProfiles?.completionDate)
          : "",
        validityPeriod: certificateProfiles?.validityPeriod,
        teamMembers: certificateProfiles?.profiles,
      });
    }
  }, [certificateProfiles]);

  const fetchProfileData = async () => {
    await getProfiles({
      where: {
        limit: -1,
      },
    });
  };
  useEffect(() => {
    fetchProfileData(); //fetch porfile data for teamMembers' dropdown list
  }, []);

  if (profileLoading) {
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
        <div
          style={{ border: "1px solid #D9D9D9", borderRadius: 5, padding: 20 }}
        >
          <Row className={commonStyles.formGroup}>
            <Col className="d-flex flex-column ">
              <Label className={commonStyles.formLabel}>
                {"Team Members "}
                <span className={commonStyles.errorText}>*</span>
              </Label>{" "}
              <Controller
                name="teamMembers"
                control={control}
                defaultValue={[]}
                rules={{
                  required: "Please select at least one team member", // Custom error message
                  validate: (selectedUsers) => selectedUsers.length > 0, // Custom validation rule
                }}
                render={({ field }) => (
                  <AssignUsersDropdown
                    profiles={profileInfo}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.teamMembers && (
                <span className={commonStyles.errorText}>
                  {errors.teamMembers.message}
                </span>
              )}
            </Col>
            <Col className="d-flex flex-column ">
              <Label className={commonStyles.formLabel}>
                {"Expiry Date "}
                <span className={commonStyles.errorText}>*</span>
              </Label>
              <Controller
                name="expiryDate"
                control={control}
                rules={{
                  required: "Expiry date is required", // Custom error message
                }}
                render={({ field }) => (
                  <CustomDatePicker
                    selectedDate={field.value}
                    onChange={(date) => field.onChange(date)}
                    fieldName={field.name}
                  />
                )}
              />
              {errors.expiryDate && (
                <span className={commonStyles.errorText}>
                  {errors.expiryDate.message}
                </span>
              )}
            </Col>
          </Row>
          <Row className={commonStyles.formGroup}>
            <Col className="d-flex flex-column ">
              <Label className={commonStyles.formLabel}>Issue Date</Label>
              <Controller
                name="issueDate"
                control={control}
                render={({ field }) => (
                  <CustomDatePicker
                    selectedDate={field.value}
                    onChange={(date) => field.onChange(date)}
                    fieldName={field.name}
                  />
                )}
              />
            </Col>
            <Col className="d-flex flex-column ">
              <Label className={commonStyles.formLabel}>Completion Date</Label>
              <Controller
                name="completionDate"
                control={control}
                render={({ field }) => (
                  <CustomDatePicker
                    selectedDate={field.value}
                    onChange={(date) => field.onChange(date)}
                    fieldName={field.name}
                  />
                )}
              />
            </Col>
          </Row>
          <Row className={commonStyles.formGroup}>
            <Col className="d-flex flex-column ">
              <Label className={commonStyles.formLabel}>Validity Period</Label>
              <input
                type="text"
                placeholder="Enter duration"
                className={commonStyles.formInputBox}
                {...register("validityPeriod")}
              />
            </Col>
            <Col></Col>
          </Row>
        </div>
        <div style={{ display: "flex", paddingTop: 30, marginTop: "auto" }}>
          <button
            type="button"
            className={commonStyles.formCancelBtn}
            onClick={() => {
              if (isDirty) {
                handleLeaveOpen(true);
                setRedirectLink("/settings/certifications");
              } else {
                router.push("/settings/certifications");
              }
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={commonStyles.formCreateBtn}
            style={{ marginLeft: "auto" }}
          >
            {params.assignuseraction === "create" ? "Add" : "Save changes"}
          </button>
        </div>
      </form>
    );
  }
};

export default AssignUserForm;
