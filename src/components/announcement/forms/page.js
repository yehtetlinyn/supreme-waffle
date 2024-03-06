"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter, useParams, usePathname } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { Form, Col, Label, Row, Button } from "reactstrap";
import Image from "next/image";
import { toast } from "react-toastify";
import { FaCircleInfo } from "react-icons/fa6";
import { GrEdit } from "react-icons/gr";
import { IoIosAddCircle, IoIosClose } from "react-icons/io";
import commonStyles from "../../styles/commonStyles.module.css";
import formStyle from "./style.module.css";
import usePageStore from "@/store/pageStore";
import { API_URL } from "@/config";
import { extractPageName, uploadFile, isImageFile } from "@/utils/helpers";
import CustomDatePicker from "@/components/base/customDatePicker";
import ToggleSwitchButton from "@/components/base/toggleSwitchButton";
import useNewsStore from "@/store/newsStore";
import NoData from "@/components/noData/noData";

const FormContents = ({
  formParams = "",
  actionMode,
  disabled = false,
  isPinned = false,
  publishDate = null,
  endDate = null,
  newsImages = null,
  startDateRequired = false,
  endDateRequired = false,
  enableNewsPageMode = false,
  noExpiry,
  callBackData,
  submitDataCallBack,
  handlePinCallBack,
  handlePublishDateCallBack,
  handleEndDateCallBack,
  handleIsExpiredCallBack,
}) => {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();

  const fileInputRef = useRef(null);

  const handleLeaveOpen = usePageStore((state) => state.handleLeaveOpen);

  const {
    imagePreviews,
    setImagePreviews,
    setUploadedFileIds,
    removeExistingImages,
    removeExistingOneImage,
    removeUploadedImages,
  } = useNewsStore((state) => ({
    imagePreviews: state.imagePreviews,
    setImagePreviews: state.setImagePreviews,
    setUploadedFileIds: state.setUploadedFileIds,
    removeExistingImages: state.removeExistingImages,
    removeExistingOneImage: state.removeExistingOneImage,
    removeUploadedImages: state.removeUploadedImages,
  }));

  const {
    handleSubmit,
    control,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: callBackData?.title,
      description: callBackData?.content,
    },
  });

  const [isFocused, setIsFocused] = useState(false);

  const descInput = watch("description");
  const primaryPageName = extractPageName(pathname, 1);
  const secondaryPageName = extractPageName(pathname, 2);
  const UPLOAD_URL = `${newsImages?.attributes?.url}`;
  const writeOnlyMode = ["create", "edit"].includes(actionMode);
  const scheduleBorder = formParams
    ? "var(--light-gray)"
    : "var(--error-border)";

  const handleButtonClick = () => {
    fileInputRef.current.click(); // Trigger the click event of the hidden file input
  };

  const handleFileSelection = async () => {
    const fileInput = fileInputRef.current.files;

    if (!fileInput || fileInput.length === 0) {
      toast.error(
        "Please select at least one image file (JPEG, PNG, GIF, or SVG)."
      );
      return;
    }

    const uploadedIds = [];
    const previews = [];

    for (let i = 0; i < fileInput.length; i++) {
      const file = fileInput[i];

      if (!isImageFile(file)) {
        toast.error(
          "Please select a valid image file (JPEG, PNG, GIF, or SVG)."
        );
        return;
      }

      const fileId = await uploadFile(file);
      uploadedIds.push(fileId);

      // Show image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        previews.push(reader.result);
        if (previews.length === fileInput.length) {
          setUploadedFileIds(uploadedIds);
          setImagePreviews(previews);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const formatDate = (date) => {
    if (date) {
      return new Date(date);
    } else {
      return null;
    }
  };

  const handleDescriptionFocus = () => {
    setIsFocused(true);
  };

  const fetchCallBackData = async () => {
    if (callBackData) {
      setValue("title", callBackData?.title);
      setValue("description", callBackData?.content);
      setValue("publishDate", callBackData?.publishDate);
      setValue("endDate", callBackData?.endDate);
    }
  };

  const handleEditDetails = () => {
    handleLeaveOpen(false);
    router.push(`/${primaryPageName}/${secondaryPageName}/edit/${params?.id}`);
  };

  const handleCancelAction = () => {
    if (actionMode === "edit") {
      handleLeaveOpen(true);
    } else {
      router.push(`/${primaryPageName}/${secondaryPageName}`);
    }
  };

  useEffect(() => {
    fetchCallBackData();
  }, [callBackData]);

  return (
    <>
      <Form
        id={formParams}
        role="form"
        onSubmit={handleSubmit(submitDataCallBack)}
        className={commonStyles.formWrapper}
      >
        {actionMode === "view" && (
          <div className={formStyle.editDetail}>
            <button type="button" onClick={handleEditDetails}>
              <GrEdit size={16} />
              Edit Detail
            </button>
          </div>
        )}

        <div className={formStyle.formBorder}>
          <Row className={commonStyles.formGroup}>
            <Col className="d-flex flex-column ">
              <Label className={commonStyles.formLabel}>Title</Label>
              <input
                type="text"
                {...register("title", {
                  required: "This field is required",
                  message: "This field is required",
                })}
                placeholder="A Continually Unfolding History"
                className={
                  errors.title
                    ? commonStyles.errorFormInputBox
                    : commonStyles.formInputBox
                }
                readOnly={actionMode === "view"}
              />
              {errors.title && (
                <p className={`mt-2 ${formStyle["error-msg"]}`}>
                  <FaCircleInfo /> {errors.title.message}
                </p>
              )}
            </Col>
          </Row>
          <Row className={commonStyles.formGroup}>
            <Col className="d-flex flex-column">
              <Label className={commonStyles.formLabel}>Description</Label>
              {writeOnlyMode &&
                isFocused &&
                descInput &&
                descInput?.length !== 0 && (
                  <div className="mb-0">
                    {descInput?.length <= 255 ? (
                      <p className={formStyle["error-msg"]}>
                        Maximum of 255 characters - {255 - descInput?.length}{" "}
                        characters left
                      </p>
                    ) : (
                      <p className={formStyle["error-msg"]}>
                        <FaCircleInfo />
                        Cannot exceed more than 255 Characters
                      </p>
                    )}
                  </div>
                )}
              <textarea
                rows={"3"}
                id={"description"}
                maxLength={255}
                {...register("description", {
                  required: "This field is required",
                  message: "This field is required",
                })}
                className={
                  errors.description
                    ? commonStyles.errorFormInputBox
                    : commonStyles.formInputBox
                }
                readOnly={actionMode === "view"}
                onFocus={handleDescriptionFocus}
              />
              {errors.description && (
                <p className={`mt-2 ${formStyle["error-msg"]}`}>
                  <FaCircleInfo /> {errors.description.message}
                </p>
              )}
            </Col>
          </Row>

          {(enableNewsPageMode && (
            <Row className={commonStyles.formGroup}>
              <Col className="d-flex flex-column">
                <Label className={commonStyles.formLabel}>Upload Image</Label>
                <div className={formStyle.contentWrapper}>
                  {writeOnlyMode && (imagePreviews || newsImages) ? (
                    <div>
                      <span className={formStyle.uploadWrapper}>
                        <button
                          type="button"
                          onClick={handleButtonClick}
                          className={formStyle.uploadButton}
                        >
                          <IoIosAddCircle
                            color="var(--primary-yellow)"
                            size={40}
                          />
                        </button>
                        <input
                          type="file"
                          ref={fileInputRef}
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={handleFileSelection}
                        />
                      </span>
                    </div>
                  ) : !writeOnlyMode && !newsImages ? (
                    <div>
                      <NoData />
                    </div>
                  ) : null}

                  <div className={formStyle.uploadContainer}>
                    {imagePreviews &&
                      imagePreviews.map((preview, index) => (
                        <div key={index} style={{ position: "relative" }}>
                          <Image
                            src={preview}
                            width={150}
                            height={100}
                            alt={`Uploaded preview ${index}`}
                            className={formStyle.previewImage}
                          />
                          {writeOnlyMode && (
                            <button
                              type="button"
                              onClick={() => removeUploadedImages(index)}
                              className={formStyle.removeImage}
                            >
                              <IoIosClose color="var(--white)" size={30} />
                            </button>
                          )}
                        </div>
                      ))}
                    {newsImages &&
                      Array.isArray(newsImages) &&
                      newsImages.map((preview, index) => (
                        <div key={index} style={{ position: "relative" }}>
                          <Image
                            src={`${preview?.attributes?.url}`}
                            width={150}
                            height={100}
                            alt={`Uploaded preview ${index}`}
                            className={formStyle.previewImage}
                          />
                          {writeOnlyMode && (
                            <button
                              type="button"
                              onClick={() => removeExistingImages(index)}
                              className={formStyle.removeImage}
                            >
                              <IoIosClose color="var(--white)" size={30} />
                            </button>
                          )}
                        </div>
                      ))}
                    {newsImages && newsImages?.attributes?.name && (
                      <div style={{ position: "relative" }}>
                        <Image
                          src={UPLOAD_URL}
                          width={150}
                          height={100}
                          alt={"Uploaded preview"}
                          className={formStyle.previewImage}
                        />
                        {writeOnlyMode && (
                          <button
                            type="button"
                            onClick={removeExistingOneImage}
                            className={formStyle.removeImage}
                          >
                            <IoIosClose color="var(--white)" size={30} />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Col>
            </Row>
          )) ||
            null}

          <Row className={commonStyles.formGroup}>
            <Col>
              <div className="d-flex flex-row">
                <div className={formStyle.statusItems}>
                  <div className={commonStyles.formLabel}>
                    Pin this {enableNewsPageMode ? "news" : "announcement"}
                  </div>
                  <div className={formStyle.alignStart}>
                    <ToggleSwitchButton
                      checked={isPinned}
                      handleChange={handlePinCallBack}
                    />
                  </div>
                </div>
              </div>
            </Col>
          </Row>

          <Row className={commonStyles.formGroup}>
            <Col className="d-flex flex-column">
              <Label className={commonStyles.formLabel}>
                {enableNewsPageMode ? "News" : "Announcement"} Schedule
              </Label>
              <div
                className={formStyle.contentWrapper}
                style={{ border: `1px solid ${scheduleBorder}` }}
              >
                <div className="me-auto" style={{ marginLeft: "1rem" }}>
                  <Label className={commonStyles.formLabel}>Start Date</Label>
                  <Controller
                    name="publishDate"
                    control={control}
                    rules={{
                      validate: (value) => {
                        if (startDateRequired) {
                          return false;
                        } else {
                          return true;
                        }
                      },
                    }}
                    render={({ field: { value } }) => {
                      return (
                        <>
                          <CustomDatePicker
                            selectedDate={formatDate(publishDate)}
                            noExpiredflag={noExpiry}
                            enableStartDate={true}
                            actionMode={actionMode}
                            onChange={handlePublishDateCallBack}
                          />
                        </>
                      );
                    }}
                  />
                </div>
                <div className="me-auto" style={{ marginLeft: "1rem" }}>
                  <Label className={commonStyles.formLabel}>End Date</Label>
                  <Controller
                    name="endDate"
                    control={control}
                    rules={{
                      validate: (value) => {
                        if (endDateRequired) {
                          return false;
                        } else {
                          return true;
                        }
                      },
                    }}
                    render={({ field: { value } }) => {
                      return (
                        <>
                          <CustomDatePicker
                            selectedDate={formatDate(endDate)}
                            noExpiredflag={noExpiry}
                            enableEndDate={true}
                            actionMode={actionMode}
                            onChange={handleEndDateCallBack}
                          />
                        </>
                      );
                    }}
                  />
                </div>
                <div
                  className="d-inline-flex me-auto mt-4"
                  style={{ marginLeft: "1rem" }}
                >
                  <div className={formStyle.statusItems}>
                    <div className={commonStyles.formLabel}>No Expiry Date</div>
                    <div className={formStyle.alignStart}>
                      <ToggleSwitchButton
                        checked={noExpiry}
                        handleChange={handleIsExpiredCallBack}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {!formParams && (
                <p className={`mt-2 ${formStyle["error-msg"]}`}>
                  <FaCircleInfo />{" "}
                  {`Please provide a valid ${
                    enableNewsPageMode ? "news" : "announcement"
                  } schedule.`}
                </p>
              )}
            </Col>
          </Row>
        </div>

        {(actionMode !== "view" && (
          <div className={formStyle.submitContainer}>
            <Row>
              <Col>
                <Button
                  type="button"
                  className={commonStyles.formCancelBtn}
                  onClick={handleCancelAction}
                >
                  Cancel
                </Button>
              </Col>
              <Col className="text-end">
                <Button
                  disabled={disabled}
                  type="submit"
                  form={formParams}
                  className={commonStyles.formCreateBtn}
                >
                  {actionMode === "create" ? "Create" : "Save"}
                </Button>
              </Col>
            </Row>
          </div>
        )) ||
          null}
      </Form>
    </>
  );
};

export default FormContents;
