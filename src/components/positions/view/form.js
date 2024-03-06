"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import commonStyles from "../../styles/commonStyles.module.css";
import createStyle from "../create/createPosition.module.css";
import { Col, Form, Label, Row, Dropdown, DropdownToggle } from "reactstrap";
import { GrEdit } from "react-icons/gr";
import { useParams, useRouter } from "next/navigation";
import apolloClient from "@/lib/apolloClient";
import { GET_POSITIONS } from "@/graphql/queries/positions";
import Loading from "@/components/modals/loading";

const ViewForm = (props) => {
  const params = useParams();
  const router = useRouter();
  const { register, setValue } = useForm();
  const [selectedCurrecy, setSelectedCurrency] = useState();
  const [loading, setLoading] = useState(true);

  const fetchPositionData = async () => {
    const { data } = await apolloClient.query({
      fetchPolicy: "network-only",
      query: GET_POSITIONS,
      variables: {
        id: params?.id,
      },
    });

    if (data) {
      const values = data.positions.data[0];
      props.setPositionName(values.attributes.name);
      setValue("name", values.attributes.name);
      setValue("salary", values.attributes.salary);
      setValue("description", values.attributes.description);
      setSelectedCurrency(values.attributes.currency);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPositionData();
  }, []);

  if (!loading) {
    return (
      <>
        <Form role="form" className={commonStyles.formWrapper}>
          <div className={createStyle.editDetail}>
            <button
              type="button"
              onClick={() =>
                router.push(`/settings/positions/edit/${params.id}`)
              }
            >
              <GrEdit size={16} />
              Edit Detail
            </button>
          </div>
          <div className={createStyle.formBorder}>
            <Row className={commonStyles.formGroup}>
              <Col className="d-flex flex-column ">
                <Label className={commonStyles.formLabel}>Name</Label>
                <input
                  type="text"
                  {...register("name")}
                  placeholder="Enter position name"
                  className={commonStyles.formInputBox}
                  readOnly={true}
                />
              </Col>
            </Row>
            <Row className={commonStyles.formGroup}>
              <Col className="d-flex flex-column ">
                <Label className={commonStyles.formLabel}>Salary</Label>
                <div className={createStyle.dropdownInputWrapper}>
                  <Dropdown>
                    <DropdownToggle disabled={true} caret>
                      {selectedCurrecy}
                    </DropdownToggle>
                  </Dropdown>
                  <input
                    type="number"
                    min={0}
                    onWheel={(event) => event.currentTarget.blur()}
                    {...register("salary")}
                    placeholder="Enter amount"
                    className={commonStyles.formInputBox}
                    readOnly={true}
                  />
                </div>
              </Col>
            </Row>
            <Row className={commonStyles.formGroup}>
              <Col className="d-flex flex-column ">
                <Label className={commonStyles.formLabel}>Description</Label>
                <textarea
                  rows={"3"}
                  {...register("description")}
                  className={commonStyles.formInputBox}
                  readOnly={true}
                />
              </Col>
            </Row>
          </div>
        </Form>
      </>
    );
  } else {
    return <Loading />;
  }
};

export default ViewForm;
