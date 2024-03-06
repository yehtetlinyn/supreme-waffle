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
import { FaPencil } from "react-icons/fa6";
import { useParams, usePathname, useRouter } from "next/navigation";
import { shallow } from "zustand/shallow";
import { useMutation } from "@apollo/client";
import { UPDATE_SOP_MASTER } from "@/graphql/mutations/sopMaster";
import { CREATE_SITE_SOP, UPDATE_SITE_SOP } from "@/graphql/mutations/siteSop";

import { priorityOptions } from "@/utils/data";
import { extractPageName, findIndexesOfErrorTasks } from "@/utils/helpers";

import apolloClient from "@/lib/apolloClient";
import styles from "@/components/siteManagement/site.module.css";
import commonStyles from "@/components/styles/commonStyles.module.css";
import masterSOPStyles from "@/components/masterSOP/masterSOP.module.css";
import SelectBox from "@/components/selectBox";
import Link from "next/link";
import NoData from "@/components/noData/noData";
import Loading from "@/components/modals/loading";
import usePageStore from "@/store/pageStore";
import useSiteSopStore from "@/store/siteSopStore";
import useMasterSOPStore from "@/store/masterSOPStore";
import useIncidentTypeStore from "@/store/incidentTypeStore";

import CustomBreadcrumb from "@/components/manageLayout/breadcrumb";
import DeleteConfirmation from "@/components/modals/delete";

const EditMasterSOPForm = ({
  setMasterSOPName = () => {},
  view = false,
  setIsView = () => {},
  previewSop = false,
}) => {
  const maxCharacters = 255;
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const pathname = usePathname();
  const pageName =
    extractPageName(pathname, 1) + "/" + extractPageName(pathname, 2);

  const incidentTypeRef = useRef();
  const impactRef = useRef();
  const priorityRef = useRef();

  const [selectedAccordion, setSelectedAccordion] = useState(0);
  const [isAddMoreClick, setIsAddMoreClick] = useState(false);

  const [taskName, setTaskName] = useState("");
  const [deleteCollapseIndex, setDeleteCollapseIndex] = useState(0);
  const [deleteModal, setdeleteModal] = useState(false);
  const toggle = () => {
    setdeleteModal(!deleteModal);
  };

  const setIsFormDirty = usePageStore((state) => state.setIsFormDirty);

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

  const {
    fetchMasterSOPById,
    masterSOPData,
    loading: masterSOPLoading,
  } = useMasterSOPStore(
    (state) => ({
      fetchMasterSOPById: state.fetchMasterSOPById,
      loading: state.loading,
      masterSOPData: state.masterSOPData,
    }),
    shallow
  );

  const {
    leaveModal: isLeaveModal,
    handleLeaveOpen,
    setSiteTabName,
  } = usePageStore(
    (state) => ({
      leaveModal: state.leaveModal,
      handleLeaveOpen: state.handleLeaveOpen,
      setSiteTabName: state.setSiteTabName,
    }),
    shallow
  );

  const {
    copyMasterSopData,
    setCopyMasterSopData,
    isCopyMasterSop,
    isSiteSopModalOpen,
    setIsCopyMasterSop,
    setIsCopySopModalOpen,
    setIsSiteSopModalOpen,
    handleRefresh,
  } = useSiteSopStore(
    (state) => ({
      copyMasterSopData: state.copyMasterSopData,
      setCopyMasterSopData: state.setCopyMasterSopData,
      isCopyMasterSop: state.isCopyMasterSop,
      isSiteSopModalOpen: state.isSiteSopModalOpen,
      setIsCopyMasterSop: state.setIsCopyMasterSop,
      setIsCopySopModalOpen: state.setIsCopySopModalOpen,
      setIsSiteSopModalOpen: state.setIsSiteSopModalOpen,
      handleRefresh: state.handleRefresh,
    }),
    shallow
  );

  const breadcrumbList = isSiteSopModalOpen
    ? ["SOP", `${copyMasterSopData?.name}`] //site sop view and edit page
    : ["SOP", "Copy From Master SOP", "Create SOP"]; // site sop create page through copy from master button

  const handleBreadcrumbClick = (breadcrumbIndex) => {
    if (isCopyMasterSop) {
      //site sop creation through copy master sop btn
      if (breadcrumbIndex === 0) {
        setIsCopyMasterSop(false);
        setCopyMasterSopData(null);
      } else if (breadcrumbIndex === 1) {
        setIsCopySopModalOpen(true);
        setIsCopyMasterSop(false);
      }
    } else {
      if (breadcrumbIndex === 0) {
        if (isDirty) {
          handleLeaveOpen(!isLeaveModal);
          setSiteTabName("");
        } else {
          setIsSiteSopModalOpen(false);
          setCopyMasterSopData(null);
          setIsView(true);
        }
      } else if (breadcrumbIndex === 1) {
        setIsView(true);
      }
    }
  };

  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    setError,
    clearErrors,
    setFocus,
    watch,
    reset,
    formState: { errors, isDirty, dirtyFields },
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

  const masterSOPTasks =
    isCopyMasterSop || isSiteSopModalOpen || previewSop
      ? copyMasterSopData?.tasks?.map((task) => {
          return {
            name: task?.Name,
            steps: task?.Steps?.map((step, index) => {
              return {
                [`step${index + 1}`]: step?.Description,
              };
            }),
          };
        })
      : masterSOPData?.tasks?.map((task) => {
          return {
            name: task?.Name,
            steps: task?.Steps?.map((step, index) => {
              return {
                [`step${index + 1}`]: step?.Description,
              };
            }),
          };
        });

  //update master sop
  const [updateSOPMasterAction, { loading }] = useMutation(UPDATE_SOP_MASTER, {
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

  //create site sop througn copy master sop button
  const [createSiteSopAction, { loading: siteSopLoading }] = useMutation(
    CREATE_SITE_SOP,
    {
      client: apolloClient,
      onCompleted: (data) => {
        if (data) {
          console.log("site sop create successfully.", data);
          setIsCopyMasterSop(false);
          setCopyMasterSopData(null);
          handleRefresh();
        }
      },
      onError: (error) => {
        console.log("error", error);
      },
    }
  );

  //update site sop
  const [updateSiteSopAction, { loading: updateSiteSopLoading }] = useMutation(
    UPDATE_SITE_SOP,
    {
      client: apolloClient,
      onCompleted: (data) => {
        if (data) {
          console.log("site sop update success");
          handleRefresh();
          setIsSiteSopModalOpen(false); //go back to site sop table
          setIsView(true);
        }
      },
      onError: (error) => {
        console.log("error", error);
      },
    }
  );

  const deleteTasksHandler = () => {
    remove(deleteCollapseIndex);
    toggle();
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

  const renderBtnLabel = () => {
    if (isCopyMasterSop) {
      return siteSopLoading ? "Creating..." : "Create";
    } else {
      return loading || updateSiteSopLoading ? "Saving..." : "Save";
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

  const deleteTaskCollapse = (index, taskName) => {
    if ((isCopyMasterSop || isSiteSopModalOpen) && taskName) {
      toggle();
      setDeleteCollapseIndex(index === selectedAccordion ? null : index);
      setTaskName(taskName);
    } else {
      remove(index);
    }
  };

  //   submit data
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
      if (!isCopyMasterSop && !isSiteSopModalOpen) {
        // update master sop
        await updateSOPMasterAction({
          variables: {
            id: id,
            title: title,
            description: description,
            type: type?.value,
            impact: impact?.value,
            priority: priority?.value,
            tasks: finalMasterSOPTasks,
          },
        });
      } else if (isCopyMasterSop) {
        // site sop creation
        console.log("site sop create");
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
      } else if (isSiteSopModalOpen) {
        //site sop update
        console.log("site sop update");
        await updateSiteSopAction({
          variables: {
            siteSopId: copyMasterSopData?.id,
            siteId: id,
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

  useEffect(() => {
    if (!isCopyMasterSop && !isSiteSopModalOpen && !previewSop) {
      fetchMasterSOPById(id);
      fetchIncidentType();
    } else {
      fetchIncidentType();

      //reset for edit and view copy master sop page and preview site sop modal
      reset({
        title: copyMasterSopData?.name,
        description: copyMasterSopData?.description,
        type: {
          value: copyMasterSopData?.incident?.data?.id,
          label: copyMasterSopData?.incident?.data?.attributes?.name,
        },
        impact: {
          value: copyMasterSopData?.impact,
          label: copyMasterSopData?.impact,
        },
        priority: {
          value: copyMasterSopData?.priority,
          label: copyMasterSopData?.priority,
        },
        masterSOPTasks: masterSOPTasks,
      });
    }
  }, []);

  // reset for edit and view master sop page
  useEffect(() => {
    if (!isCopyMasterSop && !isSiteSopModalOpen && !previewSop) {
      reset({
        title: masterSOPData?.name,
        description: masterSOPData?.description,
        type: {
          value: masterSOPData?.incident?.Type?.data?.id,
          label: masterSOPData?.incident?.Type?.data?.attributes?.name,
        },
        impact: {
          value: masterSOPData?.incident?.Impact,
          label: masterSOPData?.incident?.Impact,
        },
        priority: {
          value: masterSOPData?.incident?.Priority,
          label: masterSOPData?.incident?.Priority,
        },
        masterSOPTasks: masterSOPTasks,
      });
      setMasterSOPName(masterSOPData?.name);
    }
  }, [masterSOPData]);

  useEffect(() => {
    setIsFormDirty(isDirty);
  }, [isDirty]);

  return (
    <Form
      role="form"
      onSubmit={handleSubmit(submitData)}
      className={
        previewSop ? commonStyles.previewSopForm : commonStyles.formWrapper
      }
    >
      {masterSOPLoading ? (
        <Loading />
      ) : (
        <>
          {deleteModal && (
            <DeleteConfirmation
              isOpen={deleteModal}
              toggle={toggle}
              selectedRow={taskName || "task"}
              deleteHandler={deleteTasksHandler}
              sop
            />
          )}
          <div
            className={
              isSiteSopModalOpen ? "d-flex justify-content-between" : ""
            }
          >
            {(isCopyMasterSop || isSiteSopModalOpen) && (
              <CustomBreadcrumb
                breadcrumbList={breadcrumbList}
                handleBreadcrumbClick={handleBreadcrumbClick}
              />
            )}

            {/* edit icon in view page */}
            {view && !previewSop && (
              <div className="text-end">
                <span className="mx-2">
                  <FaPencil color="var(--primary-font)" />
                </span>
                {isSiteSopModalOpen ? (
                  <>
                    {/* site sop view page */}
                    <span
                      className={`${commonStyles.blueText} ${commonStyles.pointer}`}
                      onClick={() => setIsView(false)}
                    >
                      Edit Details
                    </span>
                  </>
                ) : (
                  <>
                    {/* master sop view page */}
                    <Link
                      href={{
                        pathname: `/${pageName}/edit/${id}`,
                      }}
                    >
                      <span
                        className={`${commonStyles.blueText} ${commonStyles.pointer}`}
                      >
                        Edit Details
                      </span>
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          <div className={commonStyles.formFieldWrapper}>
            <Row className={commonStyles.formGroup}>
              <Col className="d-flex flex-column">
                <Label className={commonStyles.formLabel}>
                  Name <span className={commonStyles.errorText}>*</span>
                </Label>
                <input
                  type="text"
                  placeholder="Enter SOP Name"
                  disabled={view}
                  {...register("title", {
                    required:
                      "You have to provide a value for a required field.",
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
                {characterCount < maxCharacters &&
                  !view &&
                  dirtyFields?.description && (
                    <span className={commonStyles.formAlertMsg}>
                      Maximum of 255 characters : {characterCount} characters
                      left.
                    </span>
                  )}
                <textarea
                  type="text"
                  rows={5}
                  disabled={view}
                  maxLength={maxCharacters}
                  {...register("description")}
                  className={commonStyles.formInputBox}
                />
              </Col>
            </Row>
            <Row className={commonStyles.formGroup}>
              <Col className="d-flex flex-column">
                <Label className={commonStyles.formLabel}>
                  Incident Type{" "}
                  <span className={commonStyles.errorText}>*</span>
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
                        view={view}
                        crudForm
                        sop
                        formErrors={errors?.type}
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
                        view={view}
                        crudForm
                        sop
                        formErrors={errors?.impact}
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
                        view={view}
                        crudForm
                        sop
                        formErrors={errors?.priority}
                      />
                      {renderErrorMsg(errors?.priority?.message)}
                    </>
                  )}
                />
              </Col>
            </Row>
            <Row className={commonStyles.formGroup}>
              <Col className="d-flex flex-column">
                <Label className={commonStyles.formLabel}>Tasks</Label>
                <div className={masterSOPStyles.taskWrapper}>
                  {/* //! no entry stage */}
                  {fields.length === 0 && !view && (
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
                        <IoIosAddCircle
                          color="var(--primary-yellow)"
                          size={40}
                        />
                      </span>
                      <p>
                        Nothing to display at the moment. Start by adding a new
                        task using the button.
                      </p>
                    </div>
                  )}
                  {fields.length === 0 && view && <NoData />}
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
                      const taskName = getValues(
                        `masterSOPTasks[${index}].name`
                      );
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
                              {!view && (
                                <span
                                  onClick={() =>
                                    deleteTaskCollapse(index, taskName)
                                  }
                                  className={commonStyles.pointer}
                                  style={{
                                    position: "absolute",
                                    right: "20px",
                                    top: "22px",
                                  }}
                                >
                                  <TbTrash color="#EB5656" size={18} />
                                </span>
                              )}

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
                                <p>
                                  {getValues(`masterSOPTasks[${index}].name`)}
                                </p>
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
                                      {...register(
                                        `masterSOPTasks.${index}.name`,
                                        {
                                          required:
                                            "Task name field is required",
                                          onChange: (e) => {
                                            if (e.target.value) {
                                              clearErrors(
                                                `masterSOPTasks.${index}.name`
                                              );
                                            }
                                          },
                                        }
                                      )}
                                      className={
                                        errors?.masterSOPTasks?.[index]?.name
                                          ? commonStyles.errorFormInputBox
                                          : commonStyles.formInputBox
                                      }
                                      placeholder="Enter Task Name"
                                      disabled={view}
                                    />
                                    {renderErrorMsg(
                                      errors?.masterSOPTasks?.[index]?.name
                                        ?.message
                                    )}
                                  </Col>
                                </Row>

                                {/* //*Render the steps */}
                                {watchMasterSOPTasks[index].steps.map(
                                  (step, stepIndex) => (
                                    <Row key={stepIndex}>
                                      <Col className="d-flex flex-column mb-3">
                                        <Label
                                          className={commonStyles.formLabel}
                                        >
                                          Step {stepIndex + 1}{" "}
                                          {stepIndex === 0 && (
                                            <span
                                              className={commonStyles.errorText}
                                            >
                                              *
                                            </span>
                                          )}
                                          {stepIndex != 0 && !view && (
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
                                          disabled={view}
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
                                {!view && (
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
                                                message:
                                                  "Step1 field is required.",
                                              }
                                            );
                                            setFocus(
                                              `masterSOPTasks.${index}.steps.0.step1`
                                            );
                                          }

                                          if (!taskNameValue) {
                                            setError(
                                              `masterSOPTasks.${index}.name`,
                                              {
                                                type: "required",
                                                message:
                                                  "Task name field is required.",
                                              }
                                            );
                                            setFocus(
                                              `masterSOPTasks.${index}.name`
                                            );
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
                                                  [`step${
                                                    taskSteps.length + 1
                                                  }`]: "",
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
                                )}
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
                  {fields.length > 0 && !view && (
                    <div className={commonStyles.formButtonWrapper}>
                      <button
                        type="submit"
                        onClick={() => {
                          setIsAddMoreClick(true);
                        }}
                        className={`${styles.addMoreBtn} mb-0`}
                      >
                        <IoIosAddCircle
                          color="var(--primary-yellow)"
                          size={30}
                        />
                        <span>Add More</span>
                      </button>
                    </div>
                  )}
                </div>
              </Col>
            </Row>
          </div>
          {!view && (
            <Row className={commonStyles.formButtonWrapper}>
              <Col>
                <Button
                  type="button"
                  className={commonStyles.formCancelBtn}
                  onClick={() => {
                    if (isCopyMasterSop) {
                      setIsCopyMasterSop(false); // go back to site sop if current page is create through copy from master sop
                      setCopyMasterSopData(null); //reset state for data in master sop selection modal
                    } else if (isSiteSopModalOpen) {
                      if (isDirty) {
                        handleLeaveOpen(!isLeaveModal);
                        setSiteTabName("");
                      } else {
                        setIsView(true); // reset view state
                        setIsSiteSopModalOpen(false); // go back to site sop table page
                        setCopyMasterSopData(null);
                      }
                    } else {
                      if (isDirty) {
                        handleLeaveOpen(!isLeaveModal);
                        setSiteTabName("");
                      } else {
                        router.replace(`/${pageName}`);
                      }
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
                  disabled={loading || siteSopLoading || updateSiteSopLoading}
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
                  {renderBtnLabel()}
                </Button>
              </Col>
            </Row>
          )}
        </>
      )}
    </Form>
  );
};

export default EditMasterSOPForm;
