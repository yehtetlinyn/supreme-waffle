import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

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
import TasksForm from "./tasksForm";

const maxCharaters = 255;
const emptyDespatch = {
  id: "",
  name: "",
  code: "",
  headcount: "",
  duration: "",
  tasks: [
    {
      Name: "",
      Steps: [
        {
          Serial: "",
          Status: "",
          Description: "",
        },
      ],
    },
  ], // Add an empty task within the despatch
  description: "",
};

const DespatchForm = ({ setDeleted }) => {
  const params = useParams();
  const viewMode = params.action === "view";

  const {
    register,
    watch,
    control,
    formState: { errors },
  } = useFormContext();

  const {
    fields: despatchField,
    append: appendDespatch,
    remove: removeDespatch,
    update: updateDespatch,
  } = useFieldArray({
    control,
    name: "despatches",
    rules: {
      // required: "This field is required",
    },
  });

  const watchDespatch = watch("despatches");
  const [selectedAccordion, setSelectedAccordion] = useState(0);

  const deleteDispatchHandler = (index) => {
    if (watchDespatch?.[index].id) {
      setDeleted((prev) => [...prev, watchDespatch?.[index].id]);
    }
    index === 0 && despatchField.length === 1
      ? updateDespatch(index, emptyDespatch)
      : removeDespatch(index);
  };

  return (
    <div className={styles.fieldArrayContainer}>
      {despatchField.map((field, index) => {
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
                {watchDespatch[index].name}
                {!viewMode && (
                  <div
                    onClick={() => {
                      deleteDispatchHandler(index);
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
                        Name <p className={commonStyles.errorText}>*</p>
                      </Label>
                      <input
                        type="text"
                        placeholder="Enter despatch type name"
                        readOnly={viewMode}
                        {...register(`despatches.${index}.name`, {
                          required: "This field is required",
                        })}
                        className={
                          errors.despatches?.[index]?.name
                            ? commonStyles.errorFormInputBox
                            : commonStyles.formInputBox
                        }
                      />
                      {errors.despatches?.[index]?.name && (
                        <p className={commonStyles.errorText}>
                          {errors.despatches?.[index]?.name.message}
                        </p>
                      )}
                    </Col>
                  </Row>
                  <Row className={commonStyles.formGroup}>
                    <Col className="d-flex flex-column">
                      <Label className={commonStyles.formLabel}>
                        Code <p className={commonStyles.errorText}>*</p>
                      </Label>
                      <input
                        type="text"
                        placeholder="Enter code ID"
                        readOnly={viewMode}
                        {...register(`despatches.${index}.code`, {
                          required: "This field is required",
                        })}
                        className={
                          errors.despatches?.[index]?.code
                            ? commonStyles.errorFormInputBox
                            : commonStyles.formInputBox
                        }
                      />
                      {errors.despatches?.[index]?.code && (
                        <p className={commonStyles.errorText}>
                          {errors.despatches?.[index]?.code.message}
                        </p>
                      )}
                    </Col>
                  </Row>
                  <Row className={commonStyles.formGroup}>
                    <Col className="d-flex flex-column">
                      <Label className={commonStyles.formLabel}>
                        Headcount Number{" "}
                        <p className={commonStyles.errorText}>*</p>
                      </Label>
                      <input
                        type="number"
                        placeholder="Enter headcount"
                        readOnly={viewMode}
                        {...register(`despatches.${index}.headcount`, {
                          required: "This field is required",
                        })}
                        className={
                          errors.despatches?.[index]?.headcount
                            ? commonStyles.errorFormInputBox
                            : commonStyles.formInputBox
                        }
                      />
                      {errors.despatches?.[index]?.headcount && (
                        <p className={commonStyles.errorText}>
                          {errors.despatches?.[index]?.headcount.message}
                        </p>
                      )}
                    </Col>
                    <Col className="d-flex flex-column">
                      <Label className={commonStyles.formLabel}>
                        Duration in hours{" "}
                        <p className={commonStyles.errorText}>*</p>
                      </Label>
                      <input
                        type="text"
                        placeholder="Enter duration hours"
                        readOnly={viewMode}
                        {...register(`despatches.${index}.duration`, {
                          required: "This field is required",
                        })}
                        className={
                          errors.despatches?.[index]?.duration
                            ? commonStyles.errorFormInputBox
                            : commonStyles.formInputBox
                        }
                      />
                      {errors.despatches?.[index]?.duration && (
                        <p className={commonStyles.errorText}>
                          {errors.despatches?.[index]?.duration.message}
                        </p>
                      )}
                    </Col>
                  </Row>
                  <Row className={commonStyles.formGroup}>
                    <Col className="d-flex flex-column">
                      <Label className={commonStyles.formLabel}>Tasks</Label>
                      <TasksForm despatchIndex={index} />
                    </Col>
                  </Row>
                  <Row className={commonStyles.formGroup}>
                    <Col className="d-flex flex-column">
                      <Label className={commonStyles.formLabel}>
                        Description
                      </Label>
                      <textarea
                        rows={3}
                        maxLength={maxCharaters}
                        type="text"
                        readOnly={viewMode}
                        className={commonStyles.formInputBox}
                        {...register(`despatches.${index}.description`)}
                      />
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
            appendDespatch(emptyDespatch);
          }}
        >
          <IoIosAddCircle color="var(--primary-yellow)" size={30} />
          Add More
        </div>
      )}
    </div>
  );
};

export default DespatchForm;
