import React, { useState } from "react";
import commonStyles from "../styles/commonStyles.module.css";
import styles from "./manageUser.module.css";
import {
  Controller,
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form";
import {
  IoIosAddCircle,
  IoIosArrowDropdownCircle,
  IoIosArrowDropupCircle,
} from "react-icons/io";
import { TbTrash } from "react-icons/tb";
import SelectBox from "../selectBox";
import { Col, Collapse, Label, Row } from "reactstrap";

const AddressForm = ({
  // register,
  // control,
  defaultAddField,
  view,
  // getValues,
  // watch,
}) => {
  const [selectedAddAccordion, setSelectedAddAccordion] = useState(0);

  const {
    register,
    watch,
    control,
    formState: { errors },
  } = useFormContext();

  const {
    fields: addressFields,
    append: appendAddress,
    remove: removeAddress,
    update: updateAddress,
  } = useFieldArray({
    control,
    name: "address",
  });

  const watchAddress = watch("address");

  return (
    <div className={styles.addressContainer}>
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
                {watch(`address[${index}].title`)}
                {/* {index > 0 && ( */}
                {!view && (
                  <div
                    onClick={() => {
                      index === 0 && addressFields.length === 1
                        ? updateAddress(index, defaultAddField)
                        : removeAddress(index);
                    }}
                    className={commonStyles.pointer}
                    style={{ marginLeft: "auto" }}
                  >
                    <TbTrash color="#EB5656" size={18} />
                  </div>
                )}

                {/* )} */}
              </div>

              {/* content inside collapse */}
              <Collapse
                isOpen={selectedAddAccordion === index && isCollapsedOpen}
              >
                <div className={styles.collapseContent}>
                  <Row className={commonStyles.formGroup}>
                    <Col className="d-flex flex-column">
                      <Label className={commonStyles.formLabel}>
                        Title <p className={commonStyles.errorText}>*</p>
                      </Label>
                      <input
                        type="text"
                        placeholder="Enter title"
                        readOnly={view}
                        {...register(`address.${index}.title`, {
                          required: "This field is require",
                        })}
                        className={
                          errors.address?.[index].title
                            ? commonStyles.errorFormInputBox
                            : commonStyles.formInputBox
                        }
                      />
                      {errors.address?.[index].title && (
                        <p className={commonStyles.errorText}>
                          {errors.address?.[index].title.message}
                        </p>
                      )}
                    </Col>
                    <Col className="d-flex flex-column">
                      <Label className={commonStyles.formLabel}>
                        Address 1 <p className={commonStyles.errorText}>*</p>
                      </Label>
                      <input
                        type="text"
                        placeholder="Enter Address"
                        readOnly={view}
                        {...register(`address.${index}.address1`, {
                          required: "This field is require",
                        })}
                        className={
                          errors.address?.[index].address1
                            ? commonStyles.errorFormInputBox
                            : commonStyles.formInputBox
                        }
                      />
                      {errors.address?.[index].address1 && (
                        <p className={commonStyles.errorText}>
                          {errors.address?.[index].address1.message}
                        </p>
                      )}
                    </Col>
                  </Row>
                  <Row className={commonStyles.formGroup}>
                    <Col className="d-flex flex-column">
                      <Label className={commonStyles.formLabel}>City</Label>
                      <input
                        type="text"
                        placeholder="Enter City"
                        readOnly={view}
                        {...register(`address.${index}.city`)}
                        className={commonStyles.formInputBox}
                      />
                    </Col>
                    <Col className="d-flex flex-column">
                      <Label className={commonStyles.formLabel}>State</Label>
                      <input
                        type="text"
                        placeholder="Enter State"
                        readOnly={view}
                        {...register(`address.${index}.state`)}
                        className={commonStyles.formInputBox}
                      />
                    </Col>
                    <Col className="d-flex flex-column">
                      <Label className={commonStyles.formLabel}>
                        Postal Code
                      </Label>
                      <input
                        type="text"
                        placeholder="Enter postal code"
                        readOnly={view}
                        {...register(`address.${index}.postalCode`)}
                        className={commonStyles.formInputBox}
                      />
                    </Col>
                  </Row>
                  <Row className={commonStyles.formGroup}>
                    <Col className="d-flex flex-column ">
                      <Label>
                        Country <p className={commonStyles.errorText}>*</p>
                      </Label>
                      <Controller
                        name={`address.${index}.country`}
                        control={control}
                        rules={{
                          required: "Please select position",
                        }}
                        render={({ field: { onChange, name, value } }) => {
                          return (
                            <SelectBox
                              placeholder="Select country"
                              options={[
                                { value: "Singapore", label: "Singapore" },
                              ]}
                              onChange={onChange}
                              value={value}
                              crudForm
                              view={view}
                              formErrors={errors.address?.[index].country}
                            />
                          );
                        }}
                      />
                      {errors.address?.[index].country && (
                        <p className={commonStyles.errorText}>
                          {errors.address?.[index].country.message}
                        </p>
                      )}
                    </Col>
                    <Col className="d-flex flex-column ">
                      <Label>Time Zone</Label>
                      <Controller
                        name={`address.${index}.timeZone`}
                        control={control}
                        render={({ field: { onChange, name, value } }) => {
                          return (
                            <SelectBox
                              placeholder="Select time zone"
                              options={[
                                {
                                  value: "Asia_Singapore",
                                  label: "Asia_Singapore",
                                },
                              ]}
                              onChange={onChange}
                              value={value}
                              crudForm
                              view={view}
                            />
                          );
                        }}
                      />
                    </Col>
                  </Row>
                </div>
              </Collapse>
            </div>
          </div>
        );
      })}
      {!view && (
        <div
          className={commonStyles.formButtonWrapper}
          style={{ alignSelf: "start" }}
        >
          <div
            onClick={() => {
              appendAddress(defaultAddField);
            }}
          >
            <IoIosAddCircle color="var(--primary-yellow)" size={30} />
            Add More
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressForm;
