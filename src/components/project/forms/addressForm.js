import React, { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import {
  IoIosAddCircle,
  IoIosArrowDropdownCircle,
  IoIosArrowDropupCircle,
} from "react-icons/io";
import { TbTrash } from "react-icons/tb";
import { Col, Collapse, Label, Row } from "reactstrap";

import commonStyles from "../../styles/commonStyles.module.css";
import styles from "../../manageUser/manageUser.module.css";
import projectStyles from "../project.module.css";
import { useParams, useSearchParams } from "next/navigation";

const ProjectAddressForm = () => {
  const params = useParams();
  const viewMode = params.action === "view";
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useFormContext();

  const watchAddresses = watch("addresses");

  const {
    fields: addressFields,
    append: appendAddress,
    remove: removeAddress,
    update: updateAddress,
  } = useFieldArray({
    control,
    name: "addresses",
    rules: {
      // required: "This field is required",
    },
  });

  const [selectedAddAccordion, setSelectedAddAccordion] = useState(0);

  return (
    <>
      <div
        className={
          errors.addresses?.root
            ? projectStyles.addressError
            : projectStyles.addressContainer
        }
      >
        {!watchAddresses?.length > 0 && (
          <div
            className={projectStyles.addressInsertBox}
            onClick={() => appendAddress({})}
          >
            <IoIosAddCircle />
            Nothing to display at the moment. Start by adding a new address
            using the plus button.
          </div>
        )}
        {watchAddresses?.length > 0 && (
          <>
            {addressFields.map((field, index) => {
              const isCollapsedOpen = selectedAddAccordion === index;
              return (
                <div className={styles.collapseWrapper} key={field.id}>
                  <div>
                    {/* collapse can be expanded or collapsed independently */}
                    <div className={styles.collapseHeader}>
                      <div
                        onClick={() => {
                          setSelectedAddAccordion(
                            index === selectedAddAccordion ? null : index
                          ); //get selected accordion index
                        }}
                      >
                        {isCollapsedOpen ? (
                          <IoIosArrowDropupCircle
                            color="var(--primary-green)"
                            size={30}
                          />
                        ) : (
                          <IoIosArrowDropdownCircle
                            color="var(--primary-green)"
                            size={30}
                          />
                        )}
                      </div>
                      {watchAddresses[index].Title}
                      {!viewMode && (
                        <div
                          onClick={() => {
                            index === 0 && addressFields.length === 1
                              ? updateAddress(index, {})
                              : removeAddress(index);
                          }}
                          className={commonStyles.pointer}
                          style={{ marginLeft: "auto" }}
                        >
                          <TbTrash color="#EB5656" size={18} />
                        </div>
                      )}
                    </div>

                    {/* content inside collapse */}
                    <Collapse
                      isOpen={selectedAddAccordion === index && isCollapsedOpen}
                    >
                      <div className={styles.collapseContent}>
                        <Row className={commonStyles.formGroup}>
                          <Col className="d-flex flex-column">
                            <Label className={commonStyles.formLabel}>
                              Title
                              {/* <p className={commonStyles.errorText}>*</p> */}
                            </Label>
                            <input
                              type="text"
                              placeholder="Enter Title"
                              readOnly={viewMode}
                              {...register(`addresses.${index}.Title`, {
                                // required: "This field is required",
                              })}
                              className={
                                errors.addresses?.[index].Title
                                  ? commonStyles.errorFormInputBox
                                  : commonStyles.formInputBox
                              }
                            />
                            {errors.addresses?.[index]?.Title && (
                              <p className={commonStyles.errorText}>
                                {errors.addresses?.[index]?.Title.message}
                              </p>
                            )}
                          </Col>
                          <Col className="d-flex flex-column">
                            <Label className={commonStyles.formLabel}>
                              Address{" "}
                              {/* <p className={commonStyles.errorText}>*</p> */}
                            </Label>
                            <input
                              type="text"
                              placeholder="Enter Address"
                              readOnly={viewMode}
                              {...register(`addresses.${index}.Address1`, {
                                // required: "This field is required",
                              })}
                              className={
                                errors.addresses?.[index].Address1
                                  ? commonStyles.errorFormInputBox
                                  : commonStyles.formInputBox
                              }
                            />
                            {errors.addresses?.[index]?.Address1 && (
                              <p className={commonStyles.errorText}>
                                {errors.addresses?.[index]?.Address1.message}
                              </p>
                            )}
                          </Col>
                        </Row>
                        <Row className={commonStyles.formGroup}>
                          <Col className="d-flex flex-column">
                            <Label className={commonStyles.formLabel}>
                              Floor
                            </Label>
                            <input
                              type="text"
                              placeholder="Enter Floor"
                              readOnly={viewMode}
                              {...register(`addresses.${index}.Floor`)}
                              className={commonStyles.formInputBox}
                            />
                          </Col>
                          <Col className="d-flex flex-column">
                            <Label className={commonStyles.formLabel}>
                              Unit Number
                            </Label>
                            <input
                              type="text"
                              placeholder="Enter Unit Number"
                              readOnly={viewMode}
                              {...register(`addresses.${index}.UnitNumber`)}
                              className={commonStyles.formInputBox}
                            />
                          </Col>
                        </Row>
                        <Row className={commonStyles.formGroup}>
                          <Col className="d-flex flex-column">
                            <Label className={commonStyles.formLabel}>
                              Location{" "}
                              {/* <p className={commonStyles.errorText}>*</p> */}
                            </Label>
                            <input
                              type="text"
                              placeholder="Enter Location"
                              readOnly={viewMode}
                              {...register(`addresses.${index}.Location`, {
                                // required: "This field is required",
                              })}
                              className={
                                errors.addresses?.[index].Location
                                  ? commonStyles.errorFormInputBox
                                  : commonStyles.formInputBox
                              }
                            />
                            {errors.addresses?.[index]?.Location && (
                              <p className={commonStyles.errorText}>
                                {errors.addresses?.[index]?.Location.message}
                              </p>
                            )}
                          </Col>
                          <Col className="d-flex flex-column">
                            <Label className={commonStyles.formLabel}>
                              Postal Code
                            </Label>
                            <input
                              type="text"
                              placeholder="Enter Postal Code"
                              readOnly={viewMode}
                              {...register(`addresses.${index}.PostalCode`)}
                              className={commonStyles.formInputBox}
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
                className={commonStyles.formButtonWrapper}
                style={{ alignSelf: "start" }}
              >
                <div
                  onClick={() => {
                    appendAddress({});
                  }}
                >
                  <IoIosAddCircle color="var(--primary-green)" size={30} />
                  Add More
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default ProjectAddressForm;
