import React, { useEffect, useRef, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Col, Collapse, Form, Label, Row, Button } from "reactstrap";
import { TbTrash } from "react-icons/tb";
import { FaPencil } from "react-icons/fa6";
import {
  IoIosArrowDropdownCircle,
  IoIosArrowDropupCircle,
  IoIosAddCircle,
} from "react-icons/io";

import { useParams, usePathname, useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";
import {
  CREATE_SHIFT_SETTING,
  DELETE_SHIFT_SETTING,
  UPDATE_SHIFT_SETTING,
} from "@/graphql/mutations/shiftRoster";
import { shallow } from "zustand/shallow";

import apolloClient from "@/lib/apolloClient";
import Link from "next/link";

import useSiteStore from "@/store/siteStore";
import NoData from "@/components/noData/noData";
import Loading from "@/components/modals/loading";
import DeleteConfirmation from "@/components/modals/delete";

import styles from "@/components/siteManagement/site.module.css";
import commonStyles from "@/components/styles/commonStyles.module.css";
import {
  extractPageName,
  findErrorIndexes,
  renderErrorMsg,
} from "@/utils/helpers";
import usePageStore from "@/store/pageStore";
import MultiSelectDayPicker from "../utils/selectedDays";
import SelectBox from "@/components/selectBox";
import { timeOptions } from "@/utils/data";

const ShiftSetting = ({ view = false }) => {
  const { id } = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const pageName =
    extractPageName(pathname, 1) + "/" + extractPageName(pathname, 2);
  const selectRef = useRef();
  const [saveLoading, setSaveLoading] = useState(false);
  const [selectedAccordion, setSelectedAccordion] = useState(0);
  const [deleteCollapseIndex, setDeleteCollapseIndex] = useState(0);

  const [isAddMoreClick, setIsAddMoreClick] = useState(false);
  const [shiftName, setShiftName] = useState("");
  const [deletedIdArray, setDeletedIdArray] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const toggle = () => {
    setDeleteModal(!deleteModal);
  };

  const startTimeRef = useRef();

  const endTimeRef = useRef();
  const {
    handleRefresh,
    fetchShiftSettingBySiteId,
    shiftSettings,
    loading,
    fetch,
  } = useSiteStore(
    (state) => ({
      handleRefresh: state.handleRefresh,
      fetchShiftSettingBySiteId: state.fetchShiftSettingBySiteId,
      shiftSettings: state.shiftSettings,
      loading: state.loading,
      fetch: state.fetch,
    }),
    shallow
  );

  const {
    leaveModal: isLeaveModal,
    handleLeaveOpen,
    setSiteTabName,
    setIsFormDirty,
  } = usePageStore(
    (state) => ({
      leaveModal: state.leaveModal,
      handleLeaveOpen: state.handleLeaveOpen,
      setSiteTabName: state.setSiteTabName,
      setIsFormDirty: state.setIsFormDirty,
    }),
    shallow
  );

  const {
    register,
    reset,
    watch,
    getValues,
    control,
    setValue,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isDirty },
  } = useForm();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "shiftSetting",
  });

  const watchShiftSetting = watch("shiftSetting");

  //* styling for collapses
  const getCollapseContentClassName = ({
    isCollapsedOpen,
    index,
    errorIndex,
    hasError,
  }) => {
    if (isCollapsedOpen) {
      return styles.collapseContentOpen;
    } else if ((!isCollapsedOpen && errorIndex !== index) || !hasError) {
      return styles.collapseContentClosed;
    } else if (errorIndex === index && !isCollapsedOpen && hasError) {
      return styles.errorCollapseContentClosed;
    } else {
      return "";
    }
  };

  // create for shift setting
  const [createShiftSetting] = useMutation(CREATE_SHIFT_SETTING, {
    client: apolloClient,
    onCompleted: (data) => {
      console.log("created", data);
    },
    onError: (error) => {
      console.log("error", error);
    },
  });

  // edit for shift setting
  const [updateShiftSetting] = useMutation(UPDATE_SHIFT_SETTING, {
    client: apolloClient,
    onCompleted: (data) => {
      console.log("created", data);
    },
    onError: (error) => {
      console.log("error", error);
    },
  });

  // delete for shift setting
  const [deleteShiftSetting] = useMutation(DELETE_SHIFT_SETTING, {
    client: apolloClient,
    onCompleted: (data) => {
      console.log("deleted successfully.", data);
    },
    onError: (error) => {
      console.log("error", error);
    },
  });

  const submitData = async (data) => {
    const { shiftSetting } = data;

    if (isAddMoreClick && !errors.shiftSetting) {
      append({
        title: "",
        headCount: "",
        startTime: "",
        endTime: "",
        selectedDays: [],
      });
      setSelectedAccordion(fields.length);
    } else {
      setSaveLoading(true);
      for (let shiftSettingData of shiftSetting) {
        if (shiftSettingData?.shiftSettingId) {
          //if there is id, it means edit function
          await updateShiftSetting({
            variables: {
              title: shiftSettingData?.title,
              startTime: `${shiftSettingData?.startTime?.value}:00`,
              endTime: `${shiftSettingData?.endTime?.value}:00`,
              siteId: id,
              headCount: parseInt(shiftSettingData?.headCount),
              repeatDays: shiftSettingData?.selectedDays,
              shiftSettingId: shiftSettingData?.shiftSettingId,
            },
          });
        } else {
          //there is no id, so this is create function
          await createShiftSetting({
            variables: {
              siteId: id,
              title: shiftSettingData?.title,
              startTime: `${shiftSettingData?.startTime?.value}:00`,
              endTime: `${shiftSettingData?.endTime?.value}:00`,
              headCount: parseInt(shiftSettingData?.headCount),
              repeatDays: shiftSettingData?.selectedDays,
            },
          });
        }
      }

      //delete function
      if (deletedIdArray.length > 0) {
        for (let deletedId of deletedIdArray) {
          if (deletedId) {
            await deleteShiftSetting({
              variables: {
                shiftSettingId: deletedId,
              },
            });
          }
        }
      }
      handleRefresh();
      setSaveLoading(false);
    }
  };

  //rearrange the data structure to reset value in react hook form
  const shiftSettingData = shiftSettings?.map((data) => {
    return {
      shiftSettingId: data?.id,
      title: data?.attributes?.title,
      headCount: parseInt(data?.attributes?.numberOfHeads),
      startTime: { value: data?.attributes?.timeRange?.StartTime?.slice(0, 5) },
      endTime: { value: data?.attributes?.timeRange?.EndTime?.slice(0, 5) },
      selectedDays: data?.attributes?.repeatDays || [],
    };
  });

  const deleteHandler = () => {
    remove(deleteCollapseIndex);
    toggle();
  };

  useEffect(() => {
    if (shiftSettings) {
      reset({
        shiftSetting: shiftSettingData,
      });
    }
  }, [shiftSettings]);

  useEffect(() => {
    setIsFormDirty(isDirty);
  }, [isDirty]);

  return (
    ((loading || !shiftSettings) && <Loading />) || (
      <>
        <DeleteConfirmation
          isOpen={deleteModal}
          toggle={toggle}
          selectedRow={shiftName || "shift"}
          deleteHandler={deleteHandler}
        />
        <Form
          role="form"
          className={`d-flex flex-column ${commonStyles.formWrapper}`}
          onSubmit={handleSubmit(submitData)}
        >
          {view && (
            <div className="text-end">
              <span className="mx-2">
                <FaPencil color="var(--primary-font)" />
              </span>
              <Link
                href={{
                  pathname: `/${pageName}/edit/${id}`,
                  query: { tab: "shiftSetting" },
                }}
              >
                <span
                  className={`${commonStyles.blueText} ${commonStyles.pointer}`}
                >
                  Edit Details
                </span>
              </Link>
            </div>
          )}
          {fields.length === 0 &&
            (view ? (
              <NoData />
            ) : (
              <div
                onClick={() => {
                  append({
                    title: "",
                    headCount: "",
                    startTime: "",
                    endTime: "",
                    selectedDays: [],
                  });
                }}
                className={styles.noCollapse}
              >
                <span className={commonStyles.pointer}>
                  <IoIosAddCircle color="var(--primary-yellow)" size={40} />
                </span>
                <p>
                  Nothing to display at the moment. Start by adding a new entry
                  using the button.
                </p>
              </div>
            ))}
          {/* collapse div */}
          <div className={styles.collapseWrapper}>
            {fields.map((field, index) => {
              const isCollapsedOpen = selectedAccordion === index;

              const errorIndexes = findErrorIndexes(errors?.shiftSetting);
              const errorIndex = errorIndexes?.[index];

              const hasRequiredData =
                watchShiftSetting?.[index]?.title ||
                watchShiftSetting?.[index]?.startTime ||
                watchShiftSetting?.[index]?.endTime ||
                watchShiftSetting?.[index]?.headCount ||
                watchShiftSetting?.[index]?.selectedDays?.length > 0;

              const hasError =
                errors?.shiftSetting?.[index]?.title ||
                errors?.shiftSetting?.[index]?.startTime ||
                errors?.shiftSetting?.[index]?.endTime ||
                errors?.shiftSetting?.[index]?.headCount ||
                (errors?.shiftSetting?.[index]?.selectedDays && isAddMoreClick)
                  ? true
                  : false;

              return (
                <React.Fragment key={field.id}>
                  <div
                    className={
                      isCollapsedOpen
                        ? styles.collapsedOpen
                        : styles.collapsedClosed
                    }
                  >
                    {/* collapse can be expanded or collapsed independently */}
                    <div
                      className={getCollapseContentClassName({
                        isCollapsedOpen,
                        index,
                        errorIndex,
                        hasError,
                      })}
                    >
                      {!view && (
                        <span
                          onClick={() => {
                            if (!hasRequiredData) {
                              remove(index);
                            } else {
                              toggle();
                              setDeletedIdArray([
                                ...deletedIdArray,
                                field.shiftSettingId,
                              ]);
                              setIsAddMoreClick(false);
                              setShiftName(
                                getValues(`shiftSetting[${index}].title`)
                              );
                              setDeleteCollapseIndex(
                                index === deleteCollapseIndex ? null : index
                              ); //get selected accordion index
                            }
                          }}
                          className={commonStyles.collapseTrash}
                        >
                          <TbTrash color="#EB5656" size={18} />
                        </span>
                      )}

                      <div className={`${styles.collapse} `}>
                        <span
                          onClick={() => {
                            setSelectedAccordion(
                              index === selectedAccordion ? null : index
                            ); //get selected accordion index
                          }}
                          className={commonStyles.pointer}
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
                        </span>
                        <p>{getValues(`shiftSetting[${index}].title`)}</p>
                      </div>
                    </div>
                    {/* content inside collapse */}
                    <Collapse
                      isOpen={selectedAccordion === index && isCollapsedOpen}
                    >
                      <div className={styles.collapseContentWrapper}>
                        <Row className={commonStyles.formGroup}>
                          <Col className="d-flex flex-column">
                            <Label className={commonStyles.formLabel}>
                              Shift Title{" "}
                              <span className={commonStyles.errorText}>*</span>
                            </Label>
                            <input
                              type="text"
                              {...register(`shiftSetting.${index}.title`, {
                                required:
                                  "You have to provide a value for a required field.",
                              })}
                              className={
                                errors?.shiftSetting?.[index]?.title?.message
                                  ? commonStyles.errorFormInputBox
                                  : commonStyles.formInputBox
                              }
                              disabled={view}
                            />
                            {renderErrorMsg(
                              errors?.shiftSetting?.[index]?.title?.message
                            )}
                          </Col>
                        </Row>
                        <Row className={commonStyles.formGroup}>
                          <Col className="d-flex flex-column">
                            <Label className={commonStyles.formLabel}>
                              Number of Head Count{" "}
                              <span className={commonStyles.errorText}>*</span>
                            </Label>
                            <input
                              type="number"
                              {...register(`shiftSetting.${index}.headCount`, {
                                required:
                                  "You have to provide a value for a required field.",
                              })}
                              className={
                                errors?.shiftSetting?.[index]?.headCount
                                  ?.message
                                  ? commonStyles.errorFormInputBox
                                  : commonStyles.formInputBox
                              }
                              disabled={view}
                              onWheel={(e) => e.target.blur()}
                              onKeyDown={(e) =>
                                ["e", "E", "+", "-"].includes(e.key) &&
                                e.preventDefault()
                              }
                            />
                            {renderErrorMsg(
                              errors?.shiftSetting?.[index]?.headCount?.message
                            )}
                          </Col>
                        </Row>
                        <Row className={commonStyles.formGroup}>
                          <Col>
                            <Label className={commonStyles.formLabel}>
                              Time Range
                            </Label>

                            <Row className={styles.timeRangeWrapper}>
                              <Col className="d-flex flex-column col-6">
                                <Label className={commonStyles.formLabel}>
                                  Start Time{" "}
                                  <span className={commonStyles.errorText}>
                                    *
                                  </span>
                                </Label>
                                <Controller
                                  name={`shiftSetting.${index}.startTime`}
                                  control={control}
                                  rules={{
                                    required:
                                      "You have to provide a value for a required field.",
                                  }}
                                  render={({
                                    field: { onChange, name, value },
                                  }) => {
                                    return (
                                      <SelectBox
                                        name={name}
                                        value={value}
                                        onChange={onChange}
                                        placeholder={"Select start time"}
                                        options={timeOptions}
                                        view={view}
                                        sop
                                        crudForm
                                        formErrors={
                                          errors?.shiftSetting?.[index]
                                            ?.startTime
                                        }
                                        selectRef={startTimeRef}
                                      />
                                    );
                                  }}
                                />

                                {renderErrorMsg(
                                  errors?.shiftSetting?.[index]?.startTime
                                    ?.message
                                )}
                              </Col>
                              <Col className="d-flex flex-column col-6">
                                <Label className={commonStyles.formLabel}>
                                  End Time{" "}
                                  <span className={commonStyles.errorText}>
                                    *
                                  </span>
                                </Label>
                                <Controller
                                  name={`shiftSetting.${index}.endTime`}
                                  control={control}
                                  rules={{
                                    required:
                                      "You have to provide a value for a required field.",
                                  }}
                                  render={({
                                    field: { onChange, name, value },
                                  }) => {
                                    return (
                                      <SelectBox
                                        name={name}
                                        value={value}
                                        onChange={onChange}
                                        placeholder={"Select end time"}
                                        options={timeOptions}
                                        view={view}
                                        crudForm
                                        sop
                                        formErrors={
                                          errors?.shiftSetting?.[index]?.endTime
                                        }
                                        selectRef={endTimeRef}
                                      />
                                    );
                                  }}
                                />
                                {renderErrorMsg(
                                  errors?.shiftSetting?.[index]?.endTime
                                    ?.message
                                )}
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                        <Row className={commonStyles.formGroup}>
                          <Col className="d-flex flex-column">
                            <Label className={commonStyles.formLabel}>
                              Select Days{" "}
                              <span className={commonStyles.errorText}>*</span>
                            </Label>
                            <Controller
                              control={control}
                              name={`shiftSetting.${index}.selectedDays`}
                              rules={{
                                required:
                                  "You have to provide a value for a required field.",
                              }}
                              render={({
                                field: { onChange, value, name },
                              }) => (
                                <>
                                  <MultiSelectDayPicker
                                    onChange={onChange}
                                    value={value}
                                    index={index}
                                    view={view}
                                    selectRef={selectRef}
                                    setError={setError}
                                    clearErrors={clearErrors}
                                    errors={errors}
                                    isAddMoreClick={isAddMoreClick}
                                    setIsAddMoreClick={setIsAddMoreClick}
                                  />
                                </>
                              )}
                            />{" "}
                            {hasError &&
                              renderErrorMsg(
                                errors?.shiftSetting?.[index]?.selectedDays
                                  ?.message
                              )}
                          </Col>
                        </Row>
                      </div>
                    </Collapse>
                  </div>
                  {errorIndex === index && !isCollapsedOpen && hasError && (
                    <p className={commonStyles.errorText}>
                      You have to provide a value for a required field.
                    </p>
                  )}
                </React.Fragment>
              );
            })}
          </div>
          {/* -- show cancel and save buttons when there is no collapse and in edit stage
          -- show add more, cancel and save changes buttons when there is at least one collapse and in edit stage
          -- in view stage, we don't need these buttons
       */}
          {!view && (
            <div className={commonStyles.formButtonWrapper}>
              {fields.length > 0 && (
                <button
                  type="submit"
                  onClick={() => {
                    setIsAddMoreClick(true);
                    if (
                      errors?.shiftSetting?.[watchShiftSetting?.length - 1]
                        ?.startTime
                    ) {
                      startTimeRef.current.focus();
                    } else if (
                      errors?.shiftSetting?.[watchShiftSetting?.length - 1]
                        ?.endTime
                    ) {
                      endTimeRef.current.focus();
                    }
                  }}
                  className={styles.addMoreBtn}
                >
                  <IoIosAddCircle color="var(--primary-yellow)" size={30} />
                  <span>Add More</span>
                </button>
              )}
              <Row>
                <Col>
                  <Button
                    type="button"
                    className={commonStyles.formCancelBtn}
                    onClick={() => {
                      if (isDirty) {
                        handleLeaveOpen(!isLeaveModal);
                        setSiteTabName("");
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
                    disabled={saveLoading}
                    onClick={() => {
                      setIsAddMoreClick(false);
                      if (
                        errors?.shiftSetting?.[watchShiftSetting?.length - 1]
                          ?.startTime
                      ) {
                        startTimeRef.current.focus();
                      } else if (
                        errors?.shiftSetting?.[watchShiftSetting?.length - 1]
                          ?.endTime
                      ) {
                        endTimeRef.current.focus();
                      }
                    }}
                  >
                    {saveLoading ? "Saving..." : "Save"}
                  </Button>
                </Col>
              </Row>
            </div>
          )}
        </Form>
      </>
    )
  );
};

export default ShiftSetting;
