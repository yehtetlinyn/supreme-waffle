import React, { useEffect, useState } from "react";
import { Form, FormGroup, Label, Row, Col, Button } from "reactstrap";
import { useForm } from "react-hook-form";
import { FiMap } from "react-icons/fi";

import { useMutation } from "@apollo/client";
import { CREATE_SITE } from "@/graphql/mutations/site";
import apolloClient from "@/lib/apolloClient";

import dynamic from "next/dynamic";

import commonStyles from "../../styles/commonStyles.module.css";
import styles from "../site.module.css";

import ConfigSiteCreationModal from "@/components/modals/configSiteCreation";
import { usePathname, useRouter } from "next/navigation";
import { extractPageName } from "@/utils/helpers";

const LocationPickerModal = dynamic(
  () => import("@/components/map/locationPickerModal"),
  {
    ssr: false,
    suspense: false,
  }
);

const CreateSite = ({ location, setLocation, loadingData = false }) => {
  const maxCharacters = 255;
  const router = useRouter();
  const pathname = usePathname();
  const pageName =
    extractPageName(pathname, 1) + "/" + extractPageName(pathname, 2);
  const [createdSiteId, setCreatedSiteId] = useState(null);

  // * location picker modal
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const toggleMapModalOpen = () => setIsMapModalOpen(!isMapModalOpen);

  // * config site modal
  const [isConfigSiteModalOpen, setIsConfigSiteModalOpen] = useState(false);
  const toggleConfigSiteModalOpen = () =>
    setIsConfigSiteModalOpen(!isConfigSiteModalOpen);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    getValues,
    clearErrors,
    formState: { errors },
  } = useForm();

  const locationValue = watch("location");
  const latitudeValue = watch("latitude");
  const longitudeValue = watch("longitude");

  // * for description word count limitation
  const description = watch("description");
  const characterCount = description
    ? maxCharacters - description?.length
    : maxCharacters;

  // * set new location after choosing location on map modal
  const handleSetNewLocation = (newLocation) => {
    if (newLocation.lat && newLocation.lng) {
      setLocation(newLocation);
    }
  };

  // mutation for create site
  const [createSiteAction, { loading }] = useMutation(CREATE_SITE, {
    client: apolloClient,
    onCompleted: (data) => {
      if (data) {
        toggleConfigSiteModalOpen();
        setCreatedSiteId(data?.createSite?.data?.id);
      }
    },
    onError: (error) => {
      console.log("error", error);
    },
  });

  const goSiteListPage = () => {
    router.push(`/${pageName}`);
  };
  // * create site form submit
  const submitData = async (data) => {
    console.log("data", data);
    await createSiteAction({
      variables: {
        siteName: data.siteName,
        address: data.address,
        location: {
          Name: data.location,
          Lat: parseFloat(data.latitude),
          Long: parseFloat(data.longitude),
          Area: parseInt(data.radius),
        },
        contacts: {
          Telephone: data.telephone,
          Mobile: data.mobile,
        },
        description: data.description,
      },
    });
  };

  return (
    <>
      <ConfigSiteCreationModal
        createdSiteId={createdSiteId}
        isOpen={isConfigSiteModalOpen}
        toggle={toggleConfigSiteModalOpen}
      />
      <Form
        role="form"
        onSubmit={handleSubmit(submitData)}
        className={commonStyles.formWrapper}
      >
        <div className={commonStyles.formFieldWrapper}>
          <Row className={commonStyles.formGroup}>
            <Col className="d-flex flex-column">
              <Label className={commonStyles.formLabel}>
                Site Name <span className={commonStyles.errorText}>*</span>
              </Label>
              <input
                type="text"
                {...register("siteName", {
                  required: "You have to provide a value for a required field.",
                })}
                className={
                  errors?.siteName
                    ? commonStyles.errorFormInputBox
                    : commonStyles.formInputBox
                }
              />
              {errors?.siteName && (
                <span className={commonStyles.errorText}>
                  {errors?.siteName?.message}
                </span>
              )}
            </Col>
          </Row>
          <Row className={commonStyles.formGroup}>
            <Col className="d-flex flex-column">
              <Label className={commonStyles.formLabel}>
                Address <span className={commonStyles.errorText}>*</span>
              </Label>
              <input
                type="text"
                {...register("address", {
                  required: "You have to provide a value for a required field.",
                })}
                className={
                  errors?.address
                    ? commonStyles.errorFormInputBox
                    : commonStyles.formInputBox
                }
              />
              {errors?.address && (
                <span className={commonStyles.errorText}>
                  {errors?.address?.message}
                </span>
              )}
            </Col>
          </Row>
          <Row className={commonStyles.formGroup}>
            <Col className="d-flex flex-column">
              <Label className={commonStyles.formLabel}>
                Telephone <span className={commonStyles.errorText}>*</span>
              </Label>
              <input
                type="text"
                {...register("telephone", {
                  required: "You have to provide a value for a required field.",
                  pattern: {
                    value:
                      /^(\+{0,})(\d{0,})([(]{1}\d{1,3}[)]{0,}){0,}(\s?\d+|\+\d{2,3}\s{1}\d+|\d+){1}[\s|-]?\d+([\s|-]?\d+){1,2}(\s){0,}$/gm,

                    message: "Please enter valid telephone number.",
                  },
                })}
                className={
                  errors?.telephone
                    ? commonStyles.errorFormInputBox
                    : commonStyles.formInputBox
                }
              />
              {errors?.telephone && (
                <span className={commonStyles.errorText}>
                  {errors?.telephone?.message}
                </span>
              )}
            </Col>
            <Col className="d-flex flex-column">
              <Label className={commonStyles.formLabel}>Mobile </Label>
              <input
                type="text"
                {...register("mobile", {
                  pattern: {
                    value:
                      /^(\+{0,})(\d{0,})([(]{1}\d{1,3}[)]{0,}){0,}(\s?\d+|\+\d{2,3}\s{1}\d+|\d+){1}[\s|-]?\d+([\s|-]?\d+){1,2}(\s){0,}$/gm,

                    message: "Please enter valid contact number",
                  },
                })}
                className={
                  errors?.mobile
                    ? commonStyles.errorFormInputBox
                    : commonStyles.formInputBox
                }
              />
              {errors?.mobile && (
                <span className={commonStyles.errorText}>
                  {errors?.mobile?.message}
                </span>
              )}
            </Col>
          </Row>
          <Row className={commonStyles.formGroup}>
            <Label className={commonStyles.formLabel}>
              Location <span className={commonStyles.errorText}>*</span>
            </Label>
            <Col className={styles.location}>
              <div className={styles.chooseOnMap} onClick={toggleMapModalOpen}>
                <FiMap className="icon" />
                <span>Choose on Map</span>
              </div>
              {/* location picker modal */}
              {isMapModalOpen && (
                <LocationPickerModal
                  location={location}
                  setLocation={(newLocation) => {
                    handleSetNewLocation(newLocation);
                  }}
                  isOpen={isMapModalOpen}
                  toggle={toggleMapModalOpen}
                  loadingData={loadingData}
                  setValue={setValue}
                  getValues={getValues}
                  clearErrors={clearErrors}
                  create
                />
              )}
              <Row className={commonStyles.formGroup}>
                <Col className="d-flex flex-column">
                  <Label className={commonStyles.formLabel}>
                    Location <span className={commonStyles.errorText}>*</span>
                  </Label>
                  <input
                    type="text"
                    {...register("location", {
                      required:
                        "You have to provide a value for a required field.",
                    })}
                    className={
                      errors?.location
                        ? commonStyles.errorFormInputBox
                        : commonStyles.formInputBox
                    }
                  />
                  {errors?.location && (
                    <span className={commonStyles.errorText}>
                      {errors?.location?.message}
                    </span>
                  )}
                </Col>
                <Col className="d-flex flex-column">
                  <Label className={commonStyles.formLabel}>
                    Radius (m) <span className={commonStyles.errorText}>*</span>
                  </Label>
                  <input
                    type="number"
                    {...register("radius", {
                      required:
                        "You have to provide a value for a required field.",
                    })}
                    onWheel={(e) => e.target.blur()}
                    onKeyDown={(e) =>
                      ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
                    }
                    className={
                      errors?.radius
                        ? commonStyles.errorFormInputBox
                        : commonStyles.formInputBox
                    }
                  />
                  {errors?.radius && (
                    <span className={commonStyles.errorText}>
                      {errors?.radius?.message}
                    </span>
                  )}
                </Col>
              </Row>
              <Row>
                <Col className="d-flex flex-column">
                  <Label className={commonStyles.formLabel}>
                    Latitude <span className={commonStyles.errorText}>*</span>
                  </Label>
                  <input
                    type="text"
                    {...register("latitude", {
                      required:
                        "You have to provide a value for a required field.",
                      pattern: {
                        value: /^\d+(\.\d+)?$\s*/,
                        message: "Please enter valid latitude value.",
                      },
                    })}
                    className={
                      errors?.latitude
                        ? commonStyles.errorFormInputBox
                        : commonStyles.formInputBox
                    }
                  />
                  {errors?.latitude && (
                    <span className={commonStyles.errorText}>
                      {errors?.latitude?.message}
                    </span>
                  )}
                </Col>
                <Col className="d-flex flex-column">
                  <Label className={commonStyles.formLabel}>
                    Longitude <span className={commonStyles.errorText}>*</span>
                  </Label>
                  <input
                    type="text"
                    {...register("longitude", {
                      required:
                        "You have to provide a value for a required field.",
                      pattern: {
                        value: /^\d+(\.\d+)?$\s*/,
                        message: "Please enter valid longitude value.",
                      },
                    })}
                    className={
                      errors?.longitude
                        ? commonStyles.errorFormInputBox
                        : commonStyles.formInputBox
                    }
                  />
                  {errors?.longitude && (
                    <span className={commonStyles.errorText}>
                      {errors?.longitude?.message}
                    </span>
                  )}
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className={commonStyles.formGroup}>
            <Col className="d-flex flex-column">
              <Label className={commonStyles.formLabel}>
                Description <span className={commonStyles.errorText}>*</span>
              </Label>
              {characterCount < maxCharacters && (
                <span className={commonStyles.formAlertMsg}>
                  Maximum of 255 characters : {characterCount} characters left.
                </span>
              )}
              <textarea
                type="text"
                rows={5}
                maxLength={255}
                {...register("description", {
                  required: "You have to provide a value for a required field.",
                })}
                className={
                  errors?.description
                    ? commonStyles.errorFormInputBox
                    : commonStyles.formInputBox
                }
              />
              {errors?.description && (
                <span className={commonStyles.errorText}>
                  {errors?.description?.message}
                </span>
              )}
            </Col>
          </Row>
        </div>

        <Row className={commonStyles.formButtonWrapper}>
          <Col>
            <Button
              type="button"
              className={commonStyles.formCancelBtn}
              onClick={goSiteListPage}
            >
              Cancel
            </Button>
          </Col>
          <Col className="text-end">
            <Button
              type="submit"
              className={commonStyles.formCreateBtn}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create"}
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default CreateSite;
