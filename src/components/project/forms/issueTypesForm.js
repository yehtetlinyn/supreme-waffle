import React from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";

import commonStyles from "../../styles/commonStyles.module.css";
import styles from "../project.module.css";

import { useParams, useSearchParams } from "next/navigation";
import {
  IoIosAddCircle,
  IoIosArrowDropdownCircle,
  IoIosArrowDropupCircle,
} from "react-icons/io";
import { TbTrash } from "react-icons/tb";
import { Col, Collapse, Label, Row } from "reactstrap";
import { useState } from "react";
import SelectBox from "@/components/selectBox";
import { priorityOptions } from "@/utils/data";

const maxCharaters = 255;
const emptyIssueType = {
  id: "",
  name: "",
  impact: "",
  priority: "",
  description: "",
};

const IssueTypesForm = ({ setDeleted }) => {
  const params = useParams();
  const viewMode = params.action === "view";

  const {
    register,
    watch,
    control,
    formState: { errors },
  } = useFormContext();

  const {
    fields: issueTypesField,
    append: appendIssueType,
    remove: removeIssueType,
    update: updateIssueType,
  } = useFieldArray({
    control,
    name: "issueTypes",
    rules: {
      // required: "This field is required",
    },
  });

  const watchIssueTypes = watch("issueTypes");
  const [selectedAccordion, setSelectedAccordion] = useState(0);

  const deleteIssueTypeHandler = (index) => {
    if (watchIssueTypes?.[index].id) {
      setDeleted((prev) => [...prev, watchIssueTypes?.[index].id]);
    }
    index === 0 && issueTypesField.length === 1
      ? updateIssueType(index, emptyIssueType)
      : removeIssueType(index);
  };

  return (
    <div className={styles.fieldArrayContainer}>
      {issueTypesField.map((field, index) => {
        const isCollapsedOpen = selectedAccordion === index;
        return (
          <div className={commonStyles.collapseWrapper} key={field.id}>
            <div>
              {/* collapse can be expanded or collapsed independently */}
              <div className={commonStyles.collapseHeader}>
                <div
                  onClick={() => {
                    setSelectedAccordion(
                      index === selectedAccordion ? null : index
                    ); //get selected accordion index
                  }}
                >
                  {isCollapsedOpen ? (
                    <IoIosArrowDropupCircle
                      color="var(--primary-yellow)"
                      size={30}
                    />
                  ) : (
                    <IoIosArrowDropdownCircle
                      color="var(--primary-yellow)"
                      size={30}
                    />
                  )}
                </div>
                {watchIssueTypes[index].name}
                {!viewMode && (
                  <div
                    onClick={() => {
                      deleteIssueTypeHandler(index);
                    }}
                    className={commonStyles.pointer}
                    style={{ marginLeft: "auto" }}
                  >
                    <TbTrash color="#EB5656" size={18} />
                  </div>
                )}
              </div>

              {/* content inside collapse */}
              <Collapse isOpen={selectedAccordion === index && isCollapsedOpen}>
                <div className={commonStyles.collapseContent}>
                  <Row className={commonStyles.formGroup}>
                    <Col className="d-flex flex-column">
                      <Label className={commonStyles.formLabel}>
                        Issue Type <p className={commonStyles.errorText}>*</p>
                      </Label>
                      <input
                        type="text"
                        placeholder="Enter Issue Type"
                        readOnly={viewMode}
                        {...register(`issueTypes.${index}.name`, {
                          required: "This field is required",
                        })}
                        className={
                          errors.issueTypes?.[index]?.name
                            ? commonStyles.errorFormInputBox
                            : commonStyles.formInputBox
                        }
                      />
                      {errors.issueTypes?.[index]?.name && (
                        <p className={commonStyles.errorText}>
                          {errors.issueTypes?.[index]?.name.message}
                        </p>
                      )}
                    </Col>
                  </Row>
                  <Row className={commonStyles.formGroup}>
                    <Col className="d-flex flex-column">
                      <Label className={commonStyles.formLabel}>
                        Impact <p className={commonStyles.errorText}>*</p>
                      </Label>
                      <Controller
                        name={`issueTypes.${index}.impact`}
                        control={control}
                        rules={{ required: "This field is required" }}
                        render={({ field: { onChange, name, value } }) => {
                          return (
                            <SelectBox
                              placeholder="Select Impact"
                              options={[{ value: "Severe", label: "Severe" }]}
                              onChange={onChange}
                              value={value}
                              crudForm
                              view={viewMode}
                              formErrors={errors.issueTypes?.[index]?.impact}
                            />
                          );
                        }}
                      />
                      {errors.issueTypes?.[index]?.impact && (
                        <p className={commonStyles.errorText}>
                          {errors.issueTypes?.[index]?.impact.message}
                        </p>
                      )}
                    </Col>
                    <Col className="d-flex flex-column">
                      <Label className={commonStyles.formLabel}>
                        Priority <p className={commonStyles.errorText}>*</p>
                      </Label>
                      <Controller
                        name={`issueTypes.${index}.priority`}
                        control={control}
                        rules={{ required: "This field is required" }}
                        render={({ field: { onChange, name, value } }) => {
                          return (
                            <SelectBox
                              placeholder="Select Priority"
                              options={priorityOptions}
                              onChange={onChange}
                              value={value}
                              crudForm
                              view={viewMode}
                              formErrors={errors.issueTypes?.[index]?.priority}
                            />
                          );
                        }}
                      />
                      {errors.issueTypes?.[index]?.priority && (
                        <p className={commonStyles.errorText}>
                          {errors.issueTypes?.[index]?.priority.message}
                        </p>
                      )}
                    </Col>
                  </Row>
                  <Row className={commonStyles.formGroup}>
                    <Col className="d-flex flex-column">
                      <Label className={commonStyles.formLabel}>
                        Description <p className={commonStyles.errorText}>*</p>
                      </Label>
                      <textarea
                        rows={3}
                        maxLength={maxCharaters}
                        type="text"
                        readOnly={viewMode}
                        className={
                          errors.issueTypes?.[index]?.description
                            ? commonStyles.errorFormInputBox
                            : commonStyles.formInputBox
                        }
                        {...register(`issueTypes.${index}.description`, {
                          required: "This field is required",
                        })}
                      />
                      {errors.issueTypes?.[index]?.description && (
                        <p className={commonStyles.errorText}>
                          {errors.issueTypes?.[index]?.description.message}
                        </p>
                      )}
                    </Col>
                  </Row>
                </div>
              </Collapse>
            </div>
          </div>
        );
      })}
      {!viewMode && (
        <div
          onClick={() => {
            appendIssueType(emptyIssueType);
          }}
        >
          <IoIosAddCircle color="var(--primary-yellow)" size={30} />
          Add More
        </div>
      )}
    </div>
  );
};

export default IssueTypesForm;
