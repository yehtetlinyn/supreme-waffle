import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

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
import StepsForm from "./stepsForm";

const emptyTask = {
  Name: "",
  Steps: [
    {
      Serial: "",
      Status: "",
      Description: "",
    },
  ],
};

const TasksForm = ({ despatchIndex }) => {
  const params = useParams();
  const viewMode = params.action === "view";

  const {
    register,
    watch,
    control,
    formState: { errors },
  } = useFormContext();

  const {
    fields: taskFields,
    append: appendTasks,
    remove: removeTasks,
    update: updateTasks,
  } = useFieldArray({
    control,
    name: `despatches.${despatchIndex}.tasks`,
    rules: {
      // required: "This field is required",
    },
  });

  const watchTasks = watch(`despatches.${despatchIndex}.tasks`);
  const [selectedAccordion, setSelectedAccordion] = useState(0);

  return (
    <div className={styles.addressContainer}>
      {taskFields.map((field, index) => {
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
                {watchTasks[index].Name}
                {!viewMode && (
                  <div
                    onClick={() => {
                      index === 0 && taskFields.length === 1
                        ? updateTasks(index, emptyTask)
                        : removeTasks(index);
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
                        placeholder="Enter Task Name"
                        readOnly={viewMode}
                        {...register(
                          `despatches.${despatchIndex}.tasks.${index}.Name`,
                          {
                            required: "This field is required",
                          }
                        )}
                        className={
                          errors.despatches?.[despatchIndex]?.tasks?.[index]
                            ?.Name
                            ? commonStyles.errorFormInputBox
                            : commonStyles.formInputBox
                        }
                      />
                      {errors.despatches?.[despatchIndex]?.tasks?.[index]
                        ?.Name && (
                        <p className={commonStyles.errorText}>
                          {
                            errors.despatches?.[despatchIndex]?.tasks?.[index]
                              ?.Name.message
                          }
                        </p>
                      )}
                    </Col>
                  </Row>
                  <Row className={commonStyles.formGroup}>
                    <Col className="d-flex flex-column">
                      <Label className={commonStyles.formLabel}>Step</Label>
                      <StepsForm
                        despatchIndex={despatchIndex}
                        taskIndex={index}
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
            appendTasks(emptyTask);
          }}
        >
          <IoIosAddCircle color="var(--primary-yellow)" size={30} />
          Add More
        </div>
      )}
    </div>
  );
};

export default TasksForm;
