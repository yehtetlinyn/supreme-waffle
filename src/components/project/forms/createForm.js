import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Col, Label, Row } from "reactstrap";

import commonStyles from "../../styles/commonStyles.module.css";

import ProjectAddressForm from "./addressForm";
import TagsSelect from "./tagsSelect";
import UploadProjectDocument from "./uploadProjectDocument";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { GrEdit } from "react-icons/gr";
import Link from "next/link";

const maxCharaters = 255;

const CreateProjectForm = () => {
  const router = useRouter();
  const params = useParams();
  const viewMode = params.action === "view";

  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <>
      {viewMode && (
        <div className={commonStyles.formEditDetail}>
          <button
            type="button"
            onClick={() =>
              router.push(`/settings/project/edit/${params.id}?tab=project`)
            }
          >
            <GrEdit size={16} />
            Edit Details
          </button>
        </div>
      )}
      <Row className={commonStyles.formGroup}>
        <Col className="d-flex flex-column ">
          <Label>
            Project Name <p className={commonStyles.errorText}>*</p>
          </Label>
          <input
            type="text"
            placeholder="Enter project name"
            readOnly={viewMode}
            className={
              errors.name
                ? commonStyles.errorFormInputBox
                : commonStyles.formInputBox
            }
            {...register("name", {
              required: "This field is required",
            })}
          />
          {errors.name && (
            <p className={commonStyles.errorText}>{errors.name.message}</p>
          )}
        </Col>
      </Row>
      <Row className={commonStyles.formGroup}>
        <Col className="d-flex flex-column ">
          <Label>Description</Label>
          <textarea
            rows={3}
            maxLength={maxCharaters}
            type="text"
            readOnly={viewMode}
            className={commonStyles.formInputBox}
            {...register("description")}
          />
        </Col>
      </Row>
      <Row className={commonStyles.formGroup}>
        <Col className="d-flex flex-column ">
          <Label>
            Address
            {/* <p className={commonStyles.errorText}>*</p> */}
          </Label>
          <ProjectAddressForm />
          {errors?.addresses?.root && (
            <p className={commonStyles.errorText}>
              {errors?.addresses?.root?.message}
            </p>
          )}
        </Col>
      </Row>
      <Row className={commonStyles.formGroup}>
        <Col className="d-flex flex-column ">
          <Label>
            Tags <p className={commonStyles.errorText}>*</p>
          </Label>
          <Controller
            name="tags"
            control={control}
            rules={{
              required: "This field is required",
            }}
            render={({ field: { onChange, name, value } }) => {
              return (
                <TagsSelect
                  value={value}
                  onChange={onChange}
                  formErrors={errors.tags}
                />
              );
            }}
          />
          {errors.tags && (
            <p className={commonStyles.errorText}>{errors.tags.message}</p>
          )}
        </Col>
      </Row>
      <Row className={commonStyles.formGroup}>
        <Col className="d-flex flex-column ">
          <Label>Upload Document</Label>
          <Controller
            name="document"
            control={control}
            render={({ field: { onChange, name, value } }) => {
              return (
                <UploadProjectDocument onChange={onChange} value={value} />
              );
            }}
          />
        </Col>
      </Row>
    </>
  );
};

export default CreateProjectForm;
