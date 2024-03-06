import React from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";

import commonStyles from "../../styles/commonStyles.module.css";
import styles from "../project.module.css";
import { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import {
  IoIosAddCircle,
  IoIosArrowDropdownCircle,
  IoIosArrowDropupCircle,
} from "react-icons/io";
import { Col, Collapse, Label, Row } from "reactstrap";
import { TbTrash } from "react-icons/tb";
import { statusOptions } from "@/utils/data";
import SelectBox from "@/components/selectBox";

const emptyStep = {
  Serial: "",
  Status: "",
  Description: "",
};

const StepsForm = ({ despatchIndex, taskIndex }) => {
  const params = useParams();
  const viewMode = params.action === "view";

  const {
    register,
    watch,
    control,
    formState: { errors },
  } = useFormContext();

  const {
    fields: stepFields,
    append: appendSteps,
    remove: removeSteps,
    update: updateSteps,
  } = useFieldArray({
    control,
    name: `despatches.${despatchIndex}.tasks.${taskIndex}.Steps`,
    rules: {
      // required: "This field is required",
    },
  });

  const watchSteps = watch(
    `despatches.${despatchIndex}.tasks.${taskIndex}.Steps`
  );
  const [selectedAccordion, setSelectedAccordion] = useState(0);

  return (
    <div className={styles.fieldArrayContainer}>
      {stepFields.map((field, index) => {
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
                {watchSteps[index].Serial}
                {!viewMode && (
                  <div
                    onClick={() => {
                      index === 0 && stepFields.length === 1
                        ? updateSteps(index, emptyStep)
                        : removeSteps(index);
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
                        Serial <p className={commonStyles.errorText}>*</p>
                      </Label>
                      <input
                        type="text"
                        placeholder="Enter Serial"
                        readOnly={viewMode}
                        {...register(
                          `despatches.${despatchIndex}.tasks.${taskIndex}.Steps.${index}.Serial`,
                          {
                            required: "This field is required",
                          }
                        )}
                        className={
                          errors.despatches?.[despatchIndex]?.tasks?.[taskIndex]
                            ?.Steps?.[index]?.Serial
                            ? commonStyles.errorFormInputBox
                            : commonStyles.formInputBox
                        }
                      />
                      {errors.despatches?.[despatchIndex]?.tasks?.[taskIndex]
                        ?.Steps?.[index]?.Serial && (
                        <p className={commonStyles.errorText}>
                          {
                            errors.despatches?.[despatchIndex]?.tasks?.[
                              taskIndex
                            ]?.Steps?.[index]?.Serial?.message
                          }
                        </p>
                      )}
                    </Col>
                    <Col className="d-flex flex-column">
                      <Label className={commonStyles.formLabel}>
                        Status <p className={commonStyles.errorText}>*</p>
                      </Label>
                      <Controller
                        name={`despatches.${despatchIndex}.tasks.${taskIndex}.Steps.${index}.Status`}
                        control={control}
                        rules={{ required: "This field is required" }}
                        render={({ field: { onChange, name, value } }) => {
                          return (
                            <SelectBox
                              placeholder="Select Status"
                              options={statusOptions}
                              onChange={onChange}
                              value={value}
                              crudForm
                              view={viewMode}
                              formErrors={
                                errors.despatches?.[despatchIndex]?.tasks?.[
                                  taskIndex
                                ]?.Steps?.[index]?.Status
                              }
                            />
                          );
                        }}
                      />
                      {errors.despatches?.[despatchIndex]?.tasks?.[taskIndex]
                        ?.Steps?.[index]?.Status && (
                        <p className={commonStyles.errorText}>
                          {
                            errors.despatches?.[despatchIndex]?.tasks?.[
                              taskIndex
                            ]?.Steps?.[index]?.Status?.message
                          }
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
                        type="text"
                        readOnly={viewMode}
                        className={
                          errors.despatches?.[despatchIndex]?.tasks?.[taskIndex]
                            ?.Steps?.[index]?.Description
                            ? commonStyles.errorFormInputBox
                            : commonStyles.formInputBox
                        }
                        {...register(
                          `despatches.${despatchIndex}.tasks.${taskIndex}.Steps.${index}.Description`,
                          {
                            required: "This field is required",
                          }
                        )}
                      />
                      {errors.despatches?.[despatchIndex]?.tasks?.[taskIndex]
                        ?.Steps?.[index]?.Description && (
                        <p className={commonStyles.errorText}>
                          {
                            errors.despatches?.[despatchIndex]?.tasks?.[
                              taskIndex
                            ]?.Steps?.[index]?.Description?.message
                          }
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
            appendSteps(emptyStep);
          }}
          style={{ textAlign: "center" }}
        >
          <IoIosAddCircle color="var(--primary-yellow)" size={30} />
          Add Step
        </div>
      )}
    </div>
  );
};

export default StepsForm;
