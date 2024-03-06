"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Col, Label, Row } from "reactstrap";
import { useParams, useRouter } from "next/navigation";
import { GrEdit } from "react-icons/gr";

import commonStyles from "../../styles/commonStyles.module.css";
import CustomDropdown from "./customDropdown";
import Link from "next/link";
import CertificateIconDropdown from "./customDropdown";
import usePageStore from "@/store/pageStore";
import LeaveConfirmation from "@/components/modals/leave";
import { shallow } from "zustand/shallow";

const CertActionForm = ({ submit, fetchedData }) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { isDirty },
  } = useForm({
    defaultValues: {
      certiName: "",
      providerName: "",
      trainingLocation: "",
      duration: "",
      description: "",
      certiVertificaion: "",
    },
  });
  const params = useParams();
  const router = useRouter();

  const maxCharaters = 255;
  const [remainCharacter, setReaminCharacter] = useState(maxCharaters);

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

  useEffect(() => {
    setIsFormDirty(isDirty);
  }, [isDirty]);

  useEffect(() => {
    reset({
      icon: fetchedData?.logo,
      certiName: fetchedData?.name,
      providerName: fetchedData?.providerName,
      trainingLocation: fetchedData?.trainingLocation,
      duration: fetchedData?.duration,
      description: fetchedData?.description,
      certiVerification: fetchedData?.verification,
    });
  }, [fetchedData]);

  const onDescriptionChange = (typedCharacters) => {
    setReaminCharacter(maxCharaters - typedCharacters.length);
  };

  const selectOption = (option) => {
    setValue("icon", option);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(submit)}
        className={commonStyles.formWrapper}
      >
        {params.action === "view" && (
          <div className={commonStyles.formEditDetail}>
            <Link href={`/settings/certifications/edit/${params?.id}`}>
              <button>
                <GrEdit size={16} />
                Edit Details
              </button>
            </Link>
          </div>
        )}
        <div style={{ overflowY: "auto", overflowX: "hidden" }}>
          <Row className={commonStyles.formGroup}>
            <Col className="d-flex flex-column ">
              <Label className={commonStyles.formLabel}>Name</Label>
              <div style={{ position: "relative" }}>
                <Controller
                  name="icon"
                  control={control}
                  render={({ field }) => (
                    <CertificateIconDropdown
                      selectOption={selectOption}
                      value={field.value}
                      disable={params?.action === "view"}
                    />
                  )}
                />
                <input
                  type="text"
                  placeholder="Enter certification name"
                  disabled={params?.action === "view"}
                  className={commonStyles.formInputBox}
                  style={{ width: "100%", paddingLeft: 180 }}
                  {...register("certiName")}
                />
              </div>
            </Col>
          </Row>
          <Row className={commonStyles.formGroup}>
            <Col className="d-flex flex-column ">
              <Label className={commonStyles.formLabel}>Provider Name</Label>
              <input
                type="text"
                placeholder="Enter provider name"
                disabled={params?.action === "view"}
                className={commonStyles.formInputBox}
                {...register("providerName")}
              />
            </Col>
            <Col className="d-flex flex-column ">
              <Label className={commonStyles.formLabel}>
                Training Location
              </Label>
              <input
                type="text"
                placeholder="Enter training location"
                disabled={params?.action === "view"}
                className={commonStyles.formInputBox}
                {...register("trainingLocation")}
              />
            </Col>
          </Row>
          <Row className={commonStyles.formGroup}>
            <Col className="d-flex flex-column ">
              <Label className={commonStyles.formLabel}>Duration</Label>
              <input
                type="text"
                placeholder="Enter duration"
                disabled={params?.action === "view"}
                className={commonStyles.formInputBox}
                {...register("duration")}
              />
            </Col>
          </Row>
          <Row className={commonStyles.formGroup}>
            <Col className="d-flex flex-column ">
              <Label className={commonStyles.formLabel}>Description</Label>
              {remainCharacter < maxCharaters && (
                <span className={commonStyles.formAlertMsg}>
                  {`Maximum of ${maxCharaters} characters : ${remainCharacter} characters left.`}
                </span>
              )}
              <textarea
                rows={3}
                maxLength={maxCharaters}
                type="text"
                disabled={params?.action === "view"}
                className={commonStyles.formInputBox}
                {...register("description")}
                onChange={(event) => onDescriptionChange(event.target.value)}
              />
            </Col>
          </Row>
          <Row className={commonStyles.formGroup}>
            <Col className="d-flex flex-column ">
              <Label className={commonStyles.formLabel}>
                Certification Verification
              </Label>
              <textarea
                rows={3}
                type="text"
                disabled={params?.action === "view"}
                className={commonStyles.formInputBox}
                {...register("certiVerification")}
              />
            </Col>
          </Row>
        </div>
        {params.action !== "view" && (
          <div style={{ display: "flex", paddingTop: 30 }}>
            <button
              type="button"
              className={commonStyles.formCancelBtn}
              onClick={() => {
                if (isDirty) {
                  handleLeaveOpen(true);
                } else {
                  router.back();
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
              {params.action === "create" ? "Create" : "Save"}
            </button>
          </div>
        )}
      </form>
    </>
  );
};

export default CertActionForm;
