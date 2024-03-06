"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Col,
  Form,
  Label,
  Row,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
} from "reactstrap";
import { useRouter } from "next/navigation";

import commonStyles from "../../styles/commonStyles.module.css";
import createStyle from "./createPosition.module.css";

import { GrEdit } from "react-icons/gr";
import apolloClient from "@/lib/apolloClient";

import { CREATE_POSITIONS } from "@/graphql/mutations/positions";
import { useMutation } from "@apollo/client";
import usePositionStore from "@/store/position";
import Loading from "@/components/modals/loading";

const currencyOption = [
  { value: "USD", label: "USD" },
  { value: "SGD", label: "SGD" },
];

const CreateForm = (props) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      name: "",
      currency: currencyOption[0],
      salary: "",
      description: "",
    },
  });
  const [isOpen, setIsOpen] = useState(false);

  const maxCharaters = 255;
  const watchDescription = watch("description");

  const {
    getPositions,
    positionInfo,
    loading: positionInfoLoading,
  } = usePositionStore((state) => ({
    getPositions: state.getPositions,
    positionInfo: state.positionInfo,
    loading: state.loading,
  }));

  const fetchPositionsData = async () => {
    await getPositions({
      where: {
        deleted: false,
        limit: -1,
      },
    });
  };

  useEffect(() => {
    fetchPositionsData();
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // mutation for create position
  const [createPositionAction, { loading }] = useMutation(CREATE_POSITIONS, {
    client: apolloClient,
    onCompleted: (data) => {
      if (data) {
        router.back();
      }
    },
    onError: (error) => {
      console.log("error", error);
    },
  });

  const submitData = async (data) => {
    await createPositionAction({
      variables: {
        data: {
          name: data.name,
          currency: data.currency?.value,
          salary: +data.salary,
          description: data.description,
        },
      },
    });
  };

  if (positionInfoLoading) {
    return (
      <div>
        <Loading />
      </div>
    );
  } else {
    return (
      <>
        <Form
          role="form"
          onSubmit={handleSubmit(submitData)}
          className={commonStyles.formWrapper}
        >
          {props.action === "view" && (
            <div
              className={createStyle.editDetail}
              onClick={() => router.push("/settings/positions/edit")}
            >
              <button>
                <GrEdit size={16} />
                Edit Detail
              </button>
            </div>
          )}
          <div className={createStyle.formBorder}>
            <Row className={commonStyles.formGroup}>
              <Col className="d-flex flex-column ">
                <Label className={commonStyles.formLabel}>Name</Label>
                <input
                  type="text"
                  placeholder="Enter position name"
                  readOnly={props.action === "view"}
                  className={
                    errors.name
                      ? commonStyles.errorFormInputBox
                      : commonStyles.formInputBox
                  }
                  {...register("name", {
                    required: "This field is required",
                    validate: (value) =>
                      positionInfo?.filter(
                        (position) =>
                          position.name.toLowerCase().trim() ===
                          value.toLowerCase().trim()
                      ).length === 0 || "Already registered",
                  })}
                />
                {errors.name && (
                  <p className={commonStyles.errorText}>
                    {errors.name.message}
                  </p>
                )}
              </Col>
            </Row>
            <Row className={commonStyles.formGroup}>
              <Col className="d-flex flex-column ">
                <Label className={commonStyles.formLabel}>Salary</Label>
                <div className={createStyle.dropdownInputWrapper}>
                  <Controller
                    name={"currency"}
                    control={control}
                    render={({ field: { onChange, name, value } }) => {
                      return (
                        <Dropdown isOpen={isOpen} toggle={toggleDropdown}>
                          <DropdownToggle caret>{value?.label}</DropdownToggle>
                          <DropdownMenu>
                            {currencyOption.map((currency) => (
                              <DropdownItem
                                key={currency.id}
                                onClick={() => onChange(currency)}
                              >
                                {currency.label}
                              </DropdownItem>
                            ))}
                          </DropdownMenu>
                        </Dropdown>
                      );
                    }}
                  />
                  <input
                    type="number"
                    min={0}
                    onWheel={(event) => event.currentTarget.blur()}
                    {...register("salary")}
                    placeholder="Enter amount"
                    className={commonStyles.formInputBox}
                    readOnly={props.action === "view"}
                  />
                </div>
              </Col>
            </Row>
            <Row className={commonStyles.formGroup}>
              <Col className="d-flex flex-column ">
                <Label className={commonStyles.formLabel}>Description</Label>
                {watchDescription?.length > 0 && (
                  <span className={commonStyles.formAlertMsg}>
                    Maximum of 255 characters :{" "}
                    {maxCharaters - watchDescription?.length} characters left.
                  </span>
                )}
                <textarea
                  rows={"3"}
                  id={"description"}
                  maxLength={255}
                  {...register("description")}
                  className={`${commonStyles.formInputBox}`}
                  readOnly={props.action === "view"}
                />
              </Col>
            </Row>
          </div>

          {props.action !== "view" && (
            <div className={createStyle.submitContainer}>
              <Row>
                <Col>
                  <Button
                    type="button"
                    className={commonStyles.formCancelBtn}
                    onClick={() => router.back()}
                  >
                    Cancel
                  </Button>
                </Col>
                <Col className="text-end">
                  <Button type="submit" className={commonStyles.formCreateBtn}>
                    {props?.action === "create" ? "Create" : "Save Changes"}
                  </Button>
                </Col>
              </Row>
            </div>
          )}
        </Form>
      </>
    );
  }
};

export default CreateForm;
