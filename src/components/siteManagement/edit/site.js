import React, { useEffect, useState } from "react";
import { Form, FormGroup, Label, Row, Col, Button } from "reactstrap";
import { useForm } from "react-hook-form";
import { FaPencil } from "react-icons/fa6";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import { useMutation } from "@apollo/client";
import { GET_SITE } from "@/graphql/queries/site";
import { UPDATE_SITE } from "@/graphql/mutations/site";

import { shallow } from "zustand/shallow";
import useSiteStore from "@/store/siteStore";

import Link from "next/link";

import styles from "../site.module.css";
import commonStyles from "../../styles/commonStyles.module.css";
import apolloClient from "@/lib/apolloClient";
//import LocationPickerModal from "@/components/map/locationPickerModal";
import Loading from "@/components/modals/loading";
import dynamic from "next/dynamic";
import { extractPageName } from "@/utils/helpers";
import usePageStore from "@/store/pageStore";
import { FiMap } from "react-icons/fi";

const LocationPickerModal = dynamic(
  () => import("@/components/map/locationPickerModal"),
  {
    ssr: false,
    suspense: false,
  }
);
const EditSite = ({ view = false, location, setLocation }) => {
  const maxCharacters = 255;
  const pathname = usePathname();
  const pageName =
    extractPageName(pathname, 1) + "/" + extractPageName(pathname, 2);

  const { fetch, handleRefresh } = useSiteStore(
    (state) => ({
      fetch: state.fetch,
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

  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    getValues,
    clearErrors,
    formState: { errors, isDirty, dirtyFields },
  } = useForm();

  const { id } = useParams();

  const [siteData, setSiteData] = useState(null);
  const [loading, setLoading] = useState(false);

  // * location picker modal
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const toggleMapModalOpen = () => setIsMapModalOpen(!isMapModalOpen);

  // * set new location after choosing location on map modal
  const handleSetNewLocation = (newLocation) => {
    if (newLocation.lat && newLocation.lng) {
      setLocation(newLocation);
    }
  };

  // * for description word count limitation
  const description = watch("description");
  const characterCount = description
    ? maxCharacters - description?.length
    : maxCharacters;

  const fetchSiteData = async () => {
    setLoading(true);
    const { data } = await apolloClient.query({
      fetchPolicy: "network-only",
      query: GET_SITE,
      variables: {
        id: id,
      },
    });

    if (data) {
      setSiteData(data?.site?.data?.attributes);
      setLoading(false);
    }
  };

  // mutation for update site
  const [updateSiteAction, { loading: saveLoading }] = useMutation(
    UPDATE_SITE,
    {
      client: apolloClient,
      onCompleted: () => {
        console.log("update completed");
        handleRefresh();
      },
      onError: (error) => {
        console.log("error", error);
      },
    }
  );

  // edit site form submit
  const submitData = async (data) => {
    console.log("data", data);
    await updateSiteAction({
      variables: {
        id: id,
        data: {
          name: data.siteName,
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
      },
    });
  };

  useEffect(() => {
    fetchSiteData();
  }, [fetch]);

  useEffect(() => {
    setIsFormDirty(isDirty);
  }, [isDirty]);

  // show the site data in the input fields
  useEffect(() => {
    reset({
      siteName: siteData?.name,
      address: siteData?.address,
      telephone: siteData?.contacts?.Telephone,
      mobile: siteData?.contacts?.Mobile,
      location: siteData?.location?.Name,
      radius: siteData?.location?.Area,
      latitude: siteData?.location?.Lat,
      longitude: siteData?.location?.Long,
      description: siteData?.description,
    });
  }, [siteData]);
  return loading ? (
    <Loading />
  ) : (
    <>
      <Form
        role="form"
        onSubmit={handleSubmit(submitData)}
        className={commonStyles.formWrapper}
      >
        {/* edit icon in view page */}
        {view && (
          <div className="text-end">
            <span className="mx-2">
              <FaPencil color="var(--primary-font)" />
            </span>
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
          </div>
        )}
        <div className={commonStyles.formFieldWrapper}>
          <Row className={commonStyles.formGroup}>
            <Col className="d-flex flex-column">
              <Label className={commonStyles.formLabel}>
                Site Name <span className={commonStyles.errorText}>*</span>
              </Label>
              <input
                type="text"
                disabled={view}
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
                disabled={view}
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
                disabled={view}
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
              <Label className={commonStyles.formLabel}>Mobile</Label>
              <input
                type="text"
                disabled={view}
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
                <span>{view ? "View on Map" : "Choose on Map"}</span>
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
                  setValue={setValue}
                  getValues={getValues}
                  clearErrors={clearErrors}
                  edit
                  view={view}
                />
              )}
              <Row className={commonStyles.formGroup}>
                <Col className="d-flex flex-column">
                  <Label className={commonStyles.formLabel}>
                    Location <span className={commonStyles.errorText}>*</span>
                  </Label>
                  <input
                    type="text"
                    disabled={view}
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
                    disabled={view}
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
                    disabled={view}
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
                    disabled={view}
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
                disabled={view}
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

        {!view && (
          <Row className={commonStyles.formButtonWrapper}>
            <Col>
              <Button
                type="button"
                className={commonStyles.formCancelBtn}
                onClick={() => {
                  if (isDirty) {
                    setSiteTabName("");
                    handleLeaveOpen(!isLeaveModal);
                  } else {
                    router.replace(`/${pageName}`);
                  }
                }}
              >
                Cancel
              </Button>
            </Col>
            <Col className="text-end">
              <Button type="submit" className={commonStyles.formCreateBtn}>
                {saveLoading ? "Saving..." : "Save"}
              </Button>
            </Col>
          </Row>
        )}
      </Form>
    </>
  );
};

export default EditSite;
