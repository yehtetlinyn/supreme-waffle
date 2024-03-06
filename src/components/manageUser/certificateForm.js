import React, { useEffect, useMemo, useState } from "react";
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
import CustomDatePicker from "../certifications/assignUser/datePicker";
import useCertificationsStore from "@/store/certifications";

const CertificateForm = ({
  // register,
  // control,
  defaultCertiField,
  view,
  // watch,
  // getValues,
}) => {
  const [selectedCertiAccordion, setSelectedCertiAccordion] = useState(0);
  const {
    register,
    control,
    watch,
    getValues,
    formState: { errors },
  } = useFormContext();
  const {
    fields: certificateFields,
    append: appendCertificate,
    remove: removeCertificate,
    update: updateCertificate,
  } = useFieldArray({
    control,
    name: "certificate",
  });

  const watchCertificate = watch("certificate");

  const {
    certificateInfo,
    getCertificates,
    loading: certificateLoading,
  } = useCertificationsStore((state) => ({
    certificateInfo: state.certificateInfo,
    getCertificates: state.getCertificates,
    loading: state.loading,
  }));
  const [certificateOption, setCertificateOption] = useState([]);
  const fetchCertificateData = async () => {
    await getCertificates({
      where: {
        deleted: false,
        limit: -1,
      },
    });
  };
  useEffect(() => {
    fetchCertificateData();
  }, []);

  //Set certificate option
  useMemo(() => {
    setCertificateOption(
      certificateInfo.map((certificate) => ({
        value: certificate.id,
        label: certificate.name,
      }))
    );
  }, [certificateInfo]);

  return (
    <div className={styles.addressContainer}>
      {certificateFields.map((field, index) => {
        const isCollapsedOpen = selectedCertiAccordion === index;
        return (
          <div className={styles.collapseWrapper} key={field.id}>
            <div>
              {/* collapse can be expanded or collapsed independently */}
              <div className={styles.collapseHeader}>
                <div
                  onClick={() => {
                    setSelectedCertiAccordion(
                      index === selectedCertiAccordion ? null : index
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

                {getValues(`certificate[${index}].certification.label`)}
                {!view && (
                  <div
                    onClick={() => {
                      index === 0 && certificateFields.length === 1
                        ? updateCertificate(index, defaultCertiField)
                        : removeCertificate(index);
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
                isOpen={selectedCertiAccordion === index && isCollapsedOpen}
              >
                <div className={styles.collapseContent}>
                  <Row className={commonStyles.formGroup}>
                    <Col className="d-flex flex-column">
                      <Label>Certification</Label>
                      <Controller
                        name={`certificate.${index}.certification`}
                        control={control}
                        render={({ field: { onChange, name, value } }) => {
                          return (
                            <SelectBox
                              placeholder="Select certification"
                              options={certificateOption}
                              onChange={onChange}
                              value={value}
                              crudForm
                              view={view}
                            />
                          );
                        }}
                      />
                    </Col>
                    <Col className="d-flex flex-column">
                      <Label>Expiry Date</Label>
                      <Controller
                        name={`certificate.${index}.expiryDate`}
                        control={control}
                        render={({ field }) => (
                          <CustomDatePicker
                            selectedDate={field.value}
                            onChange={(date) => field.onChange(date)}
                            fieldName={field.name}
                            disabled={view}
                          />
                        )}
                      />
                    </Col>
                  </Row>
                  <Row className={commonStyles.formGroup}>
                    <Col className="d-flex flex-column">
                      <Label>Issue Date</Label>
                      <Controller
                        name={`certificate.${index}.issueDate`}
                        control={control}
                        render={({ field }) => (
                          <CustomDatePicker
                            selectedDate={field.value}
                            onChange={(date) => field.onChange(date)}
                            fieldName={field.name}
                            disabled={view}
                          />
                        )}
                      />
                    </Col>
                    <Col className="d-flex flex-column">
                      <Label>Completion Date</Label>
                      <Controller
                        name={`certificate.${index}.completionDate`}
                        control={control}
                        render={({ field }) => (
                          <CustomDatePicker
                            selectedDate={field.value}
                            onChange={(date) => field.onChange(date)}
                            fieldName={field.name}
                            disabled={view}
                          />
                        )}
                      />
                    </Col>
                  </Row>
                  {/* <Row className={commonStyles.formGroup}>
                    <Col className="d-flex flex-column " lg="6">
                      <Label>Upload certificate document</Label>
                      <input
                        type="file"
                          disabled={params?.action === "view"}
                        className={commonStyles.browseFile}
                        {...register(`certificate.${index}.certificateDoc`)}
                      />
                    </Col>
                  </Row> */}
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
              appendCertificate(defaultCertiField);
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

export default CertificateForm;
