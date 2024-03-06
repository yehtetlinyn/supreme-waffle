"use client";
import React, { useEffect, useRef, useState } from "react";
import { useFieldArray, useForm, Controller } from "react-hook-form";
import { Form, Row, Col, Button, Label, Collapse } from "reactstrap";
import { TbTrash } from "react-icons/tb";
import {
  IoIosArrowDropdownCircle,
  IoIosArrowDropupCircle,
  IoIosAddCircle,
} from "react-icons/io";
import { AiOutlineMinusCircle } from "react-icons/ai";

import { useParams, usePathname, useRouter } from "next/navigation";
import { shallow } from "zustand/shallow";
import { useMutation } from "@apollo/client";
import { CREATE_SOP_MASTER } from "@/graphql/mutations/sopMaster";

import { priorityOptions } from "@/utils/data";

import apolloClient from "@/lib/apolloClient";
import commonStyles from "@/components/styles/commonStyles.module.css";
import styles from "@/components/siteManagement/site.module.css";
import masterSOPStyles from "@/components/masterSOP/masterSOP.module.css";
import SelectBox from "@/components/selectBox";
import useIncidentTypeStore from "@/store/incidentTypeStore";
import { extractPageName, findIndexesOfErrorTasks } from "@/utils/helpers";
import CustomBreadcrumb from "@/components/manageLayout/breadcrumb";
import { CREATE_SITE_SOP } from "@/graphql/mutations/siteSop";
import useSiteSopStore from "@/store/siteSopStore";

const CreateMasterSOPForm = ({
  isCreateSiteSopModalOpen,
  toggleCreateSiteSopModalOpen,
}) => {
  const maxCharacters = 255;
  const router = useRouter();
  const pathname = usePathname();
  const pageName =
    extractPageName(pathname, 1) + "/" + extractPageName(pathname, 2);

  const incidentTypeRef = useRef();
  const impactRef = useRef();
  const priorityRef = useRef();

  const { id } = useParams();
  const breadcrumbList = ["SOP", "Create SOP"];
  const [selectedAccordion, setSelectedAccordion] = useState(0);
  const [isAddMoreClick, setIsAddMoreClick] = useState(false);

  const {
    fetchIncidentType,
    incidentTypeData,
    loading: incidentTypeLoading,
  } = useIncidentTypeStore(
    (state) => ({
      fetchIncidentType: state.fetchIncidentType,
      incidentTypeData: state.incidentTypeData,
      loading: state.loading,
    }),
    shallow
  );

  const handleRefresh = useSiteSopStore((state) => state.handleRefresh);

  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    setError,
    setFocus,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "masterSOPTasks", // parent field array for tasks
  });

  const watchMasterSOPTasks = watch("masterSOPTasks");
  const description = watch("description");

  const characterCount = description
    ? maxCharacters - description?.length
    : maxCharacters;

  const incidentTypeOptions = incidentTypeData?.map((data) => {
    return {
      value: data?.id,
      label: data?.attributes?.name,
    };
  });

  //create master sop
  const [createMasterSOPAction, { loading }] = useMutation(CREATE_SOP_MASTER, {
    client: apolloClient,
    onCompleted: (data) => {
      if (data) {
        console.log("success", data);
        router.push(`/${pageName}`);
      }
    },
    onError: (error) => {
      console.log("error", error);
    },
  });

  // create new site sop
  const [createSiteSopAction, { loading: siteSopLoading }] = useMutation(
    CREATE_SITE_SOP,
    {
      client: apolloClient,
      onCompleted: (data) => {
        if (data) {
          console.log("site sop is created successfully.");
          toggleCreateSiteSopModalOpen();
          handleRefresh();
        }
      },
      onError: (error) => {
        console.log("error", error);
      },
    }
  );

  const getBreadcrumbName = (breadcrumbName) => {
    if (breadcrumbName === "SOP") {
      toggleCreateSiteSopModalOpen();
    }
  };

  // remove steps from form
  const removeStep = (index, stepIndex) => {
    const updatedTasks = [...watchMasterSOPTasks]; // Create a copy of the tasks array
    updatedTasks[index].steps.splice(stepIndex, 1); // Remove the specific step from the steps array

    //* Rearrange the remaining steps' keys as "step1", "step2", ...
    //* example: we have 3 steps , step1: 'a', step2: 'b', step3: 'c',
    //* after removing step2, then we left step1: 'a', step3: 'c' (step3 is currentStep key)
    //* make this step as step1: 'a', step2: 'c'
    for (
      let i = stepIndex; // i=2
      i < updatedTasks[index].steps.length;
      i++
    ) {
      const currentStepKey = Object.keys(updatedTasks[index].steps[i])[0]; //getting the key from the object(step3, step4, etc.)

      updatedTasks[index].steps[i][`step${i + 1}`] =
        updatedTasks[index].steps[i][currentStepKey]; //rearrange steps in order (step1, step2, step3) and the value is getting from currentStepKey

      delete updatedTasks[index].steps[i][currentStepKey]; //delete the old key cause we no longer needed.
    }

    setValue("masterSOPTasks", updatedTasks); // Update the value of the "masterSOPTasks" field with the modified array
  };

  //   create master sop
  const submitData = async (data) => {
    const { title, description, impact, priority, type, masterSOPTasks } = data;

    const finalMasterSOPTasks = masterSOPTasks?.map((task) => {
      return {
        Name: task.name,
        Steps: task?.steps?.map((step, index) => {
          return {
            Serial: `${index + 1}`,
            Description: step[`step${index + 1}`],
          };
        }),
      };
    });

    if (isAddMoreClick && !errors.masterSOPTasks) {
      append({
        name: "",
        steps: [{ step1: "" }],
      });
      setSelectedAccordion(fields.length);
    } else {
      if (isCreateSiteSopModalOpen) {
        console.log("crete site sop", data);
        await createSiteSopAction({
          variables: {
            siteId: id,
            title: title,
            description: description,
            type: type?.value,
            impact: impact?.value,
            priority: priority?.value,
            tasks: finalMasterSOPTasks,
          },
        });
      } else {
        await createMasterSOPAction({
          variables: {
            title: title,
            description: description,
            type: type?.value,
            impact: impact?.value,
            priority: priority?.value,
            tasks: finalMasterSOPTasks,
          },
        });
      }
    }
  };

  const handleBreadcrumbClick = (breadcrumbIndex) => {
    if (breadcrumbIndex === 0) {
      toggleCreateSiteSopModalOpen();
    }
  };

  const renderErrorMsg = (errorMsg) => {
    return (
      errorMsg && <span className={commonStyles.errorText}>{errorMsg}</span>
    );
  };

  //* styling for collapses
  const getCollapseContentClassName = ({
    isCollapsedOpen,
    index,
    errorIndex,
  }) => {
    if (isCollapsedOpen) {
      return styles.collapseContentOpen;
    } else if (!isCollapsedOpen && errorIndex !== index) {
      return styles.collapseContentClosed;
    } else if (errorIndex === index) {
      return styles.errorCollapseContentClosed;
    } else {
      return "";
    }
  };

  useEffect(() => {
    fetchIncidentType();
  }, []);

  return (
    <Form
      role="form"
      onSubmit={handleSubmit(submitData)}
      className={commonStyles.formWrapper}
    >
      {isCreateSiteSopModalOpen && (
        <CustomBreadcrumb
          breadcrumbList={breadcrumbList}
          getBreadcrumbName={getBreadcrumbName}
          handleBreadcrumbClick={handleBreadcrumbClick}
        />
      )}
      <div className={commonStyles.formFieldWrapper}>
        <Row className={commonStyles.formGroup}>
          <Col className="d-flex flex-column">
            <Label className={commonStyles.formLabel}>
              Name <span className={commonStyles.errorText}>*</span>
            </Label>
            <input
              type="text"
              placeholder="Enter SOP Name"
              {...register("title", {
                required: "You have to provide a value for a required field.",
              })}
              className={
                errors?.title
                  ? commonStyles.errorFormInputBox
                  : commonStyles.formInputBox
              }
            />
            {renderErrorMsg(errors?.title?.message)}
          </Col>
        </Row>
        <Row className={commonStyles.formGroup}>
          <Col className="d-flex flex-column">
            <Label className={commonStyles.formLabel}>Description</Label>
            {characterCount < maxCharacters && (
              <span className={commonStyles.formAlertMsg}>
                Maximum of 255 characters : {characterCount} characters left.
              </span>
            )}
            <textarea
              type="text"
              rows={5}
              maxLength={maxCharacters}
              {...register("description")}
              className={commonStyles.formInputBox}
            />
          </Col>
        </Row>
        <Row className={commonStyles.formGroup}>
          <Col className="d-flex flex-column">
            <Label className={commonStyles.formLabel}>
              Incident Type <span className={commonStyles.errorText}>*</span>
            </Label>
            <Controller
              name="type"
              control={control}
              rules={{ required: "Incident Type is required." }}
              render={({ field: { onChange, name, value } }) => (
                <>
                  <SelectBox
                    name={name}
                    placeholder={"Select incident"}
                    options={incidentTypeOptions}
                    value={value}
                    onChange={onChange}
                    selectRef={incidentTypeRef}
                    crudForm
                    sop
                    formErrors={errors?.type}
                    clearErrors={clearErrors}
                  />
                </>
              )}
            />
            {renderErrorMsg(errors?.type?.message)}
          </Col>
        </Row>
        <Row className={commonStyles.formGroup}>
          <Col className="d-flex flex-column">
            <Label className={commonStyles.formLabel}>
              Impact <span className={commonStyles.errorText}>*</span>
            </Label>
            <Controller
              name="impact"
              control={control}
              rules={{ required: "Impact is required." }}
              render={({ field: { onChange, name, value } }) => (
                <>
                  <SelectBox
                    name={name}
                    placeholder={"Select impact"}
                    options={[{ value: "Severe", label: "Severe" }]}
                    value={value}
                    onChange={onChange}
                    selectRef={impactRef}
                    crudForm
                    sop
                    formErrors={errors.impact}
                  />
                </>
              )}
            />
            {renderErrorMsg(errors?.impact?.message)}
          </Col>
          <Col className="d-flex flex-column">
            <Label className={commonStyles.formLabel}>
              Priority <span className={commonStyles.errorText}>*</span>
            </Label>
            <Controller
              name="priority"
              control={control}
              rules={{ required: "Priority is required." }}
              render={({ field: { onChange, name, value } }) => (
                <>
                  <SelectBox
                    name={name}
                    placeholder={"Select priority"}
                    options={priorityOptions}
                    value={value}
                    onChange={onChange}
                    selectRef={priorityRef}
                    priority
                    crudForm
                    sop
                    formErrors={errors.priority}
                  />
                </>
              )}
            />
            {renderErrorMsg(errors?.priority?.message)}
          </Col>
        </Row>
        <Row className={commonStyles.formGroup}>
          <Col className="d-flex flex-column">
            <Label className={commonStyles.formLabel}>Tasks</Label>
            <div className={masterSOPStyles.taskWrapper}>
              {/* //! no entry stage */}
              {fields.length === 0 && (
                <div
                  onClick={() => {
                    append({
                      name: "",
                      steps: [{ step1: "" }],
                    });
                  }}
                  className={styles.noCollapse}
                >
                  <span className={commonStyles.pointer}>
                    <IoIosAddCircle color="var(--primary-yellow)" size={40} />
                  </span>
                  <p>
                    Nothing to display at the moment. Start by adding a new task
                    using the button.
                  </p>
                </div>
              )}
              <div
              //className={styles.collapseWrapper}
              >
                {fields.map((field, index) => {
                  const isCollapsedOpen = selectedAccordion === index;

                  // find the index of the task that has errors
                  const indexesOfErrorTasks = findIndexesOfErrorTasks(
                    errors?.masterSOPTasks
                  );

                  const errorIndex = indexesOfErrorTasks[index];

                  return (
                    <React.Fragment key={field.id}>
                      <div
                        className={
                          isCollapsedOpen
                            ? styles.collapsedOpen
                            : styles.collapsedClosed
                        }
                      >
                        {/* // * collapse can be expanded or collapsed independently */}
                        <div
                          className={getCollapseContentClassName({
                            isCollapsedOpen,
                            index,
                            errorIndex,
                          })}
                        >
                          <span
                            onClick={() => {
                              remove(index);
                            }}
                            className={commonStyles.pointer}
                            style={{
                              position: "absolute",
                              right: "20px",
                              top: "22px",
                            }}
                          >
                            <TbTrash color="#EB5656" size={18} />
                          </span>
                          <div
                            onClick={() => {
                              setSelectedAccordion(
                                index === selectedAccordion ? null : index
                              ); //get selected accordion index>
                            }}
                            className={`${styles.collapse} ${commonStyles.pointer}`}
                          >
                            <span>
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
                            </span>
                            <p>{getValues(`masterSOPTasks[${index}].name`)}</p>
                          </div>
                        </div>
                        {/* Content inside collapse */}
                        <Collapse
                          isOpen={
                            selectedAccordion === index && isCollapsedOpen
                          }
                        >
                          <div className={styles.collapseContentWrapper}>
                            <Row className={commonStyles.formGroup}>
                              <Col className="d-flex flex-column">
                                <Label className={commonStyles.formLabel}>
                                  Name{" "}
                                  <span className={commonStyles.errorText}>
                                    *
                                  </span>
                                </Label>
                                <input
                                  type="text"
                                  {...register(`masterSOPTasks.${index}.name`, {
                                    required: "Task name field is required",
                                    onChange: (e) => {
                                      if (e.target.value) {
                                        clearErrors(
                                          `masterSOPTasks.${index}.name`
                                        );
                                      }
                                    },
                                  })}
                                  className={
                                    errors?.masterSOPTasks?.[index]?.name
                                      ? commonStyles.errorFormInputBox
                                      : commonStyles.formInputBox
                                  }
                                  placeholder="Enter Task Name"
                                />
                                {renderErrorMsg(
                                  errors?.masterSOPTasks?.[index]?.name?.message
                                )}
                              </Col>
                            </Row>

                            {/* //*Render the steps */}
                            {watchMasterSOPTasks[index].steps.map(
                              (step, stepIndex) => (
                                <Row key={stepIndex}>
                                  <Col className="d-flex flex-column mb-3">
                                    <Label className={commonStyles.formLabel}>
                                      Step {stepIndex + 1}{" "}
                                      {stepIndex === 0 && (
                                        <span
                                          className={commonStyles.errorText}
                                        >
                                          *
                                        </span>
                                      )}
                                      {stepIndex != 0 && (
                                        <span
                                          className="mx-2"
                                          onClick={() =>
                                            removeStep(index, stepIndex)
                                          }
                                        >
                                          <AiOutlineMinusCircle
                                            className={commonStyles.pointer}
                                            color="red"
                                          />
                                        </span>
                                      )}
                                    </Label>
                                    <textarea
                                      type="text"
                                      {...register(
                                        `masterSOPTasks.${index}.steps[${stepIndex}].step${
                                          stepIndex + 1
                                        }`,
                                        {
                                          required:
                                            stepIndex === 0
                                              ? "Step1 field is required"
                                              : false,
                                          onChange: (e) => {
                                            if (e.target.value) {
                                              clearErrors(
                                                `masterSOPTasks.${index}.steps.0`
                                              );
                                            }
                                          },
                                        }
                                      )}
                                      className={
                                        errors?.masterSOPTasks?.[index]
                                          ?.steps?.[0]?.step1?.message &&
                                        stepIndex === 0
                                          ? commonStyles.errorFormInputBox
                                          : commonStyles.formInputBox
                                      }
                                      placeholder={`Enter Step ${
                                        stepIndex + 1
                                      }`}
                                    />
                                    {stepIndex === 0 &&
                                      renderErrorMsg(
                                        errors?.masterSOPTasks?.[index]
                                          ?.steps?.[0]?.step1?.message
                                      )}
                                  </Col>
                                </Row>
                              )
                            )}

                            <Row>
                              <Col className="text-center mb-2">
                                <span
                                  className={commonStyles.pointer}
                                  onClick={() => {
                                    const step1Value = getValues(
                                      `masterSOPTasks.${index}.steps.0.step1`
                                    );

                                    const taskNameValue = getValues(
                                      `masterSOPTasks.${index}.name`
                                    );

                                    // ! add task steps when click add step button

                                    if (!step1Value) {
                                      setError(
                                        `masterSOPTasks.${index}.steps.0.step1`,
                                        {
                                          type: "required",
                                          message: "Step1 field is required.",
                                        }
                                      );
                                      setFocus(
                                        `masterSOPTasks.${index}.steps.0.step1`
                                      );
                                    }

                                    if (!taskNameValue) {
                                      setError(`masterSOPTasks.${index}.name`, {
                                        type: "required",
                                        message: "Task name field is required.",
                                      });
                                      setFocus(`masterSOPTasks.${index}.name`);
                                    }

                                    if (step1Value && taskNameValue) {
                                      clearErrors(
                                        `masterSOPTasks.${index}.steps.0.step1`,
                                        `masterSOPTasks.${index}.name`
                                      );

                                      const taskSteps = getValues(
                                        `masterSOPTasks.${index}.steps`
                                      );

                                      setValue(
                                        `masterSOPTasks.${index}.steps`,
                                        [
                                          ...(taskSteps || []),
                                          {
                                            [`step${taskSteps.length + 1}`]: "",
                                          },
                                        ]
                                      );
                                    }
                                  }}
                                >
                                  <IoIosAddCircle
                                    color="var(--primary-yellow)"
                                    size={25}
                                  />{" "}
                                  Add Step
                                </span>
                              </Col>
                            </Row>
                          </div>
                        </Collapse>
                      </div>
                      {errorIndex === index && !isCollapsedOpen && (
                        <p className={commonStyles.errorText}>
                          You have to provide a value for a required field.
                        </p>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
              {fields.length > 0 && (
                <div className={commonStyles.formButtonWrapper}>
                  <button
                    type="submit"
                    onClick={() => {
                      setIsAddMoreClick(true);
                    }}
                    className={`${styles.addMoreBtn} mb-0`}
                  >
                    <IoIosAddCircle color="var(--primary-yellow)" size={30} />
                    <span>Add More</span>
                  </button>
                </div>
              )}
            </div>
          </Col>
        </Row>
      </div>
      <Row className={commonStyles.formButtonWrapper}>
        <Col>
          <Button
            type="button"
            className={commonStyles.formCancelBtn}
            onClick={() => {
              if (isCreateSiteSopModalOpen) {
                toggleCreateSiteSopModalOpen();
              } else {
                router.push(`/${pageName}`);
              }
            }}
          >
            Cancel
          </Button>
        </Col>
        <Col className="text-end">
          <Button
            type="submit"
            className={commonStyles.formCreateBtn}
            disabled={loading}
            onClick={() => {
              if (errors?.type) {
                incidentTypeRef.current.focus();
              } else if (errors?.impact) {
                impactRef.current.focus();
              } else if (errors?.priority) {
                priorityRef.current.focus();
              }
              setIsAddMoreClick(false);
            }}
          >
            {loading || siteSopLoading ? "Creating..." : "Create"}
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default CreateMasterSOPForm;
