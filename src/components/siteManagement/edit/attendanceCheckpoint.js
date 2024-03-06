import React, { useState, useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { Col, Collapse, Form, Label, Row, Button } from "reactstrap";

import { TbTrash, TbFileDescription } from "react-icons/tb";
import { FaPencil } from "react-icons/fa6";
import {
  IoIosArrowDropdownCircle,
  IoIosArrowDropupCircle,
  IoIosAddCircle,
} from "react-icons/io";

import { useParams, usePathname, useRouter } from "next/navigation";

import apolloClient from "@/lib/apolloClient";

import { UPDATE_SITE_ATTENDANCE_CHECKPOINT } from "@/graphql/mutations/site";
import { useMutation } from "@apollo/client";
import { extractPageName, findErrorIndexes, uploadFile } from "@/utils/helpers";
import { shallow } from "zustand/shallow";

import Link from "next/link";
import Loading from "@/components/modals/loading";
//import LocationPickerModal from "@/components/map/locationPickerModal";
import NoData from "@/components/noData/noData";
import commonStyles from "../../styles/commonStyles.module.css";
import styles from "../site.module.css";
import MapIcon from "@/assets/icons/mapIcon";
import useSiteStore from "@/store/siteStore";
import dynamic from "next/dynamic";
import usePageStore from "@/store/pageStore";
import DeleteConfirmation from "@/components/modals/delete";

const LocationPickerModal = dynamic(
  () => import("@/components/map/locationPickerModal"),
  {
    ssr: false,
    suspense: false,
  }
);
const EditAttendanceCheckpoint = ({
  view = false,
  location,
  setLocation,
  attendanceCheckpoint,
  loading = false,
}) => {
  const { id } = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const pageName =
    extractPageName(pathname, 1) + "/" + extractPageName(pathname, 2);

  const [selectedAccordion, setSelectedAccordion] = useState(0);
  const [isAddmoreClick, setIsAddmoreClick] = useState(false);
  const [checkpointName, setCheckpointName] = useState("");
  const [deleteCollapseIndex, setDeleteCollapseIndex] = useState(0);

  const [deleteModal, setdeleteModal] = useState(false);
  const toggle = () => {
    setdeleteModal(!deleteModal);
  };

  const { handleRefresh } = useSiteStore(
    (state) => ({
      handleRefresh: state.handleRefresh,
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

  // * location picker modal
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const toggleMapModalOpen = () => setIsMapModalOpen(!isMapModalOpen);

  const {
    register,
    reset,
    watch,
    getValues,
    control,
    setValue,
    handleSubmit,
    clearErrors,
    setError,
    formState: { errors, isDirty },
  } = useForm();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "attendanceCheckpoint",
  });

  const watchAttendanceCheckpoint = watch("attendanceCheckpoint");

  const validateCheckpointName = (value, index) => {
    const duplicateIndex = fields.findIndex(
      (field, i) => i !== index && field.checkpointName === value // Check for duplicates excluding the current field
    );

    // set error message if there is duplicate field
    if (duplicateIndex !== -1) {
      return "Checkpoint name already existed.";
    }

    return true;
  };

  // * set new location after choosing location on map modal
  const handleSetNewLocation = (newLocation) => {
    if (newLocation.lat && newLocation.lng) {
      setLocation(newLocation);
    }
  };

  //*mutation for attendance checkpoint
  const [updateAttendanceCheckpoint, { loading: saveLoading }] = useMutation(
    UPDATE_SITE_ATTENDANCE_CHECKPOINT,
    {
      client: apolloClient,
      onCompleted: (data) => {
        console.log("updated completely", data);
        handleRefresh();
      },
      onError: (error) => {
        console.log("error", error);
      },
    }
  );

  // * render error messages
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

  // change field name to be consistent with react hook form field name when reset the data
  const attendanceCheckpointData = attendanceCheckpoint?.map((data) => {
    return {
      checkpointName: data?.Name,
      location: data?.Location?.Name,
      latitude: data?.Location?.Lat,
      longitude: data?.Location?.Long,
      checkpointRadius: data?.Location?.Area,
    };
  });

  const deleteCheckPointCollapse = (index, checkpointName, hasRequiredData) => {
    if (!hasRequiredData) {
      remove(index);
    } else {
      toggle();
      setDeleteCollapseIndex(index === selectedAccordion ? null : index);
      setCheckpointName(checkpointName);
    }
  };

  const deleteCheckpointHandler = () => {
    remove(deleteCollapseIndex);
    toggle();
  };

  // * update attendance checkpoint
  const submitData = async (data) => {
    // change field name to be consistent with backend field name
    const newCheckpointData = watchAttendanceCheckpoint?.map((data) => {
      return {
        Name: data.checkpointName,
        Location: {
          Name: data.location,
          Lat: parseFloat(data.latitude),
          Long: parseFloat(data.longitude),
          Area: parseFloat(data.checkpointRadius),
        },
      };
    });

    if (isAddmoreClick && !errors.attendanceCheckpoint) {
      append({
        checkpointName: "",
        location: "",
        checkpointRadius: "",
        latitude: "",
        longitude: "",
      });
      setSelectedAccordion(fields.length);
    } else {
      await updateAttendanceCheckpoint({
        variables: {
          id: id,
          checkpointArray: newCheckpointData,
        },
      });
    }
  };

  useEffect(() => {
    if (attendanceCheckpoint) {
      reset({
        attendanceCheckpoint: attendanceCheckpointData,
      });
    }
  }, [attendanceCheckpoint]);

  useEffect(() => {
    setIsFormDirty(isDirty);
  }, [isDirty]);

  return (
    ((loading || !attendanceCheckpoint) && <Loading />) || (
      <Form
        role="form"
        className={`d-flex flex-column ${commonStyles.formWrapper}`}
        onSubmit={handleSubmit(submitData)}
      >
        {deleteModal && (
          <DeleteConfirmation
            isOpen={deleteModal}
            toggle={toggle}
            selectedRow={checkpointName || "checkpoint"}
            deleteHandler={deleteCheckpointHandler}
          />
        )}
        {view && (
          <div className="text-end">
            <span className="mx-2">
              <FaPencil color="var(--primary-font)" />
            </span>
            <Link
              href={{
                pathname: `/${pageName}/edit/${id}`,
                query: { tab: "attendanceCheckpoint" },
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
                  checkpointName: "",
                  location: "",
                  checkpointRadius: "",
                  latitude: "",
                  longitude: "",
                  //qrCodeImage: "",
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
            const errorIndexes = findErrorIndexes(errors?.attendanceCheckpoint);
            const errorIndex = errorIndexes?.[index];

            const checkpointName = getValues(
              `attendanceCheckpoint[${index}].checkpointName`
            );

            const hasRequiredData =
              watchAttendanceCheckpoint?.[index]?.location ||
              checkpointName ||
              watchAttendanceCheckpoint?.[index]?.checkpointRadius ||
              watchAttendanceCheckpoint?.[index]?.latitude ||
              watchAttendanceCheckpoint?.[index]?.longitude;

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
                    })}
                  >
                    {!view && (
                      <span
                        onClick={() => {
                          deleteCheckPointCollapse(
                            index,
                            checkpointName,
                            hasRequiredData
                          );
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
                    )}

                    <div className={`${styles.collapse}`}>
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
                      <p>
                        {getValues(
                          `attendanceCheckpoint[${index}].checkpointName`
                        )}
                      </p>
                    </div>
                  </div>

                  {/* content inside collapse */}
                  <Collapse
                    isOpen={selectedAccordion === index && isCollapsedOpen}
                  >
                    <div className={styles.collapseContentWrapper}>
                      <div
                        className={styles.chooseOnMap}
                        onClick={toggleMapModalOpen}
                      >
                        <MapIcon />
                        <span>{view ? "View on Map" : "Choose on Map"}</span>
                      </div>

                      {/* location picker modal */}
                      {isMapModalOpen && (
                        <LocationPickerModal
                          location={location}
                          setLocation={(newLocation) => {
                            handleSetNewLocation(newLocation, index);
                          }}
                          isOpen={isMapModalOpen}
                          toggle={toggleMapModalOpen}
                          //loadingData={loadingData}
                          setValue={setValue}
                          getValues={getValues}
                          clearErrors={clearErrors}
                          selectedAccordionIndex={selectedAccordion}
                          edit
                          view={view}
                        />
                      )}

                      <Row className={commonStyles.formGroup}>
                        <Col className="d-flex flex-column">
                          <Label className={commonStyles.formLabel}>
                            Checkpoint Name{" "}
                            <span className={commonStyles.errorText}>*</span>
                          </Label>
                          <input
                            type="text"
                            {...register(
                              `attendanceCheckpoint.${index}.checkpointName`,
                              {
                                required:
                                  "You have to provide a value for a required field.",
                                validate: (value) =>
                                  validateCheckpointName(value, index),
                              }
                            )}
                            className={
                              errors?.attendanceCheckpoint?.[index]
                                ?.checkpointName
                                ? commonStyles.errorFormInputBox
                                : commonStyles.formInputBox
                            }
                          />
                          {renderErrorMsg(
                            errors?.attendanceCheckpoint?.[index]
                              ?.checkpointName?.message
                          )}
                        </Col>
                      </Row>
                      <Row className={commonStyles.formGroup}>
                        <Col className="d-flex flex-column">
                          <Label className={commonStyles.formLabel}>
                            Location{" "}
                            <span className={commonStyles.errorText}>*</span>
                          </Label>
                          <input
                            type="text"
                            disabled={view}
                            {...register(
                              `attendanceCheckpoint.${index}.location`,
                              {
                                required:
                                  "You have to provide a value for a required field.",
                              }
                            )}
                            className={
                              errors?.attendanceCheckpoint?.[index]?.location
                                ? commonStyles.errorFormInputBox
                                : commonStyles.formInputBox
                            }
                          />
                          {renderErrorMsg(
                            errors?.attendanceCheckpoint?.[index]?.location
                              ?.message
                          )}
                        </Col>
                        <Col className="d-flex flex-column">
                          <Label className={commonStyles.formLabel}>
                            Checkpoint Radius (m){" "}
                            <span className={commonStyles.errorText}>*</span>
                          </Label>
                          <input
                            type="number"
                            disabled={view}
                            {...register(
                              `attendanceCheckpoint.${index}.checkpointRadius`,
                              {
                                required:
                                  "You have to provide a value for a required field.",
                              }
                            )}
                            onWheel={(e) => e.target.blur()}
                            onKeyDown={(e) =>
                              ["e", "E", "+", "-"].includes(e.key) &&
                              e.preventDefault()
                            }
                            className={
                              errors?.attendanceCheckpoint?.[index]
                                ?.checkpointRadius
                                ? commonStyles.errorFormInputBox
                                : commonStyles.formInputBox
                            }
                          />
                          {renderErrorMsg(
                            errors?.attendanceCheckpoint?.[index]
                              ?.checkpointRadius?.message
                          )}
                        </Col>
                      </Row>
                      <Row className={commonStyles.formGroup}>
                        <Col className="d-flex flex-column">
                          <Label className={commonStyles.formLabel}>
                            Latitude{" "}
                            <span className={commonStyles.errorText}>*</span>
                          </Label>
                          <input
                            type="text"
                            disabled={view}
                            {...register(
                              `attendanceCheckpoint.${index}.latitude`,
                              {
                                required:
                                  "You have to provide a value for a required field.",
                                pattern: {
                                  value: /^\d+(\.\d+)?\s*$/,
                                  message: "Please enter valid latitude value.",
                                },
                              }
                            )}
                            className={
                              errors?.attendanceCheckpoint?.[index]?.latitude
                                ? commonStyles.errorFormInputBox
                                : commonStyles.formInputBox
                            }
                          />
                          {renderErrorMsg(
                            errors?.attendanceCheckpoint?.[index]?.latitude
                              ?.message
                          )}
                        </Col>
                        <Col className="d-flex flex-column">
                          <Label className={commonStyles.formLabel}>
                            Longitude{" "}
                            <span className={commonStyles.errorText}>*</span>
                          </Label>
                          <input
                            type="text"
                            disabled={view}
                            {...register(
                              `attendanceCheckpoint.${index}.longitude`,
                              {
                                required:
                                  "You have to provide a value for a required field.",
                                pattern: {
                                  value: /^\d+(\.\d+)?\s*$/,
                                  message:
                                    "Please enter valid longitude value.",
                                },
                              }
                            )}
                            className={
                              errors?.attendanceCheckpoint?.[index]?.longitude
                                ? commonStyles.errorFormInputBox
                                : commonStyles.formInputBox
                            }
                          />
                          {renderErrorMsg(
                            errors?.attendanceCheckpoint?.[index]?.longitude
                              ?.message
                          )}
                        </Col>
                      </Row>
                    </div>
                  </Collapse>
                </div>

                {errorIndex === index && !isCollapsedOpen && (
                  <p className={commonStyles.errorText}>
                    {errors?.attendanceCheckpoint?.[index]?.checkpointName
                      ?.message ||
                      " You have to provide a value for a required field."}
                    {/* You have to provide a value for a required field. */}
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
                  setIsAddmoreClick(true);
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
                      router.replace(`/${pageName}`);
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
                  onClick={() => setIsAddmoreClick(false)}
                >
                  {saveLoading ? "Saving..." : "Save"}
                </Button>
              </Col>
            </Row>
          </div>
        )}
      </Form>
    )
  );
};

export default EditAttendanceCheckpoint;
