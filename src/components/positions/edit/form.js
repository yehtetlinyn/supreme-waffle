"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import commonStyles from "../../styles/commonStyles.module.css";
import createStyle from "../create/createPosition.module.css";
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
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import apolloClient from "@/lib/apolloClient";
import { UPDATE_POSITIONS } from "@/graphql/mutations/positions";
import { useMutation } from "@apollo/client";
import { GET_POSITIONS } from "@/graphql/queries/positions";
import Loading from "@/components/modals/loading";
import { FormPrompt } from "./formPrompt";
import usePageStore from "@/store/pageStore";
import { shallow } from "zustand/shallow";
import LeaveConfirmation from "@/components/modals/leave";

const currencyOption = [
  { value: "USD", label: "USD" },
  { value: "SGD", label: "SGD" },
];

const EditForm = (props) => {
  const router = useRouter();
  const params = useParams();
  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors, dirtyFields, defaultValues, isDirty },
  } = useForm();

  const {
    leaveModal: isLeaveModal,
    handleLeaveOpen,
    setIsFormDirty,
  } = usePageStore(
    (state) => ({
      leaveModal: state.leaveModal,
      handleLeaveOpen: state.handleLeaveOpen,
      setIsFormDirty: state.setIsFormDirty,
    }),
    shallow
  );

  const [isOpen, setIsOpen] = useState(false);
  const [selectedCurrecy, setSelectedCurrency] = useState(currencyOption[0]);
  const [loading, setLoading] = useState(true);
  const maxCharacters = 255;
  const watchDescription = watch("description");

  //To detect the form fields are dirty or not
  useMemo(() => {
    setIsFormDirty(isDirty);
  }, [isDirty]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const fetchData = async () => {
    const { data } = await apolloClient.query({
      fetchPolicy: "network-only",
      query: GET_POSITIONS,
      variables: {
        id: params.id,
      },
    });

    if (data) {
      const values = data.positions.data[0];
      props.setPositionTitle(values.attributes.name);
      reset({
        name: values.attributes.name,
        salary: values.attributes.salary,
        description: values.attributes.description,
        currency: {
          value: values.attributes.currency,
          label: values.attributes.currency,
        },
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // mutation for update position
  const [updatePositionAction, { loading: updateLoading }] = useMutation(
    UPDATE_POSITIONS,
    {
      client: apolloClient,
      onCompleted: (data) => {
        if (data) {
          router.back();
        }
      },
      onError: (error) => {
        console.log("error", error);
      },
    }
  );

  const nameValidation = (value) => {
    const inputValue = value.toLowerCase().trim();
    const sameName = props?.allPositions?.filter(
      (position) => position.name.toLowerCase().trim() === inputValue
    );
    const isNameDirty = dirtyFields.name;
    const defaultName = defaultValues?.name.toLowerCase().trim();

    if (sameName.length > 0 && inputValue != defaultName) {
      return false;
    } else {
      return true;
    }
  };

  const handleToggle = () => {
    if (isLeaveModal) {
      handleLeaveOpen(!isLeaveModal);
    }
  };

  const submitData = async (data) => {
    console.log("data", data);
    await updatePositionAction({
      variables: {
        id: params.id,
        data: {
          name: data.name,
          currency: data.currency.value,
          salary: +data.salary,
          description: data.description,
        },
      },
    });
  };

  if (loading) {
    return <Loading />;
  } else {
    return (
      <>
        {isLeaveModal && (
          <LeaveConfirmation isOpen={isLeaveModal} toggle={handleToggle} />
        )}
        <Form
          role="form"
          onSubmit={handleSubmit(submitData)}
          className={commonStyles.formWrapper}
        >
          {/* <FormPrompt hasUnsavedChanges={isDirty} /> */}
          <div className={createStyle.formBorder}>
            <Row className={commonStyles.formGroup}>
              <Col className="d-flex flex-column ">
                <Label className={commonStyles.formLabel}>Name</Label>
                <input
                  type="text"
                  placeholder="Enter position name"
                  className={
                    errors.name
                      ? commonStyles.errorFormInputBox
                      : commonStyles.formInputBox
                  }
                  {...register("name", {
                    required: "This field is required",
                    validate: (value) =>
                      nameValidation(value) || "Already registered",
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
                    {maxCharacters - watchDescription?.length} characters left.
                  </span>
                )}
                <textarea
                  rows={"3"}
                  maxLength={maxCharacters}
                  {...register("description")}
                  className={commonStyles.formInputBox}
                />
              </Col>
            </Row>
          </div>

          <div className={createStyle.submitContainer}>
            <Row>
              <Col>
                <Button
                  type="button"
                  className={commonStyles.formCancelBtn}
                  onClick={() => {
                    isDirty ? handleLeaveOpen(true) : router.back();
                  }}
                >
                  Cancel
                </Button>
              </Col>
              <Col className="text-end">
                <Button type="submit" className={commonStyles.formCreateBtn}>
                  {"Save"}
                </Button>
              </Col>
            </Row>
          </div>
        </Form>
      </>
    );
  }
};

export default EditForm;
