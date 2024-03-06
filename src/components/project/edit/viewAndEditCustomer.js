import React, { useEffect } from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import CustomerForm from "./customerForm";
import { FormProvider, useForm } from "react-hook-form";

import commonStyles from "../../styles/commonStyles.module.css";
import styles from "../project.module.css";
import { useMutation } from "@apollo/client";
import { CREATE_CUSTOMER, UPDATE_CUSTOMER } from "@/graphql/mutations/customer";
import apolloClient from "@/lib/apolloClient";
import { useParams } from "next/navigation";
import useCustomerStore from "@/store/customer";
import { shallow } from "zustand/shallow";
import Loading from "@/components/modals/loading";
import { useState } from "react";
import { GrEdit } from "react-icons/gr";

const ViewAndEditCustomer = ({ isOpen, toggle, customerID }) => {
  const methods = useForm();
  const params = useParams();

  const [mode, setMode] = useState("view");

  const {
    getCustomers,
    getCustomerByID,
    selectedCustomerData,
    loadingForSelectedCustomer,
  } = useCustomerStore(
    (state) => ({
      getCustomers: state.getCustomers,
      getCustomerByID: state.getCustomerByID,
      selectedCustomerData: state.selectedCustomerData,
      loadingForSelectedCustomer: state.loadingForSelectedCustomer,
    }),
    shallow
  );

  const fetchSelectedCustomer = async () => {
    await getCustomerByID({
      id: customerID,
    });
  };

  useEffect(() => {
    fetchSelectedCustomer();
  }, []);

  useEffect(() => {
    if (selectedCustomerData) {
      methods.reset({
        firstName: selectedCustomerData?.firstName,
        lastName: selectedCustomerData?.lastName,
        email: selectedCustomerData?.email,
        contactNumber: selectedCustomerData?.contactNumber,
      });
    }
  }, [selectedCustomerData]);

  const [updateCustomerAction] = useMutation(UPDATE_CUSTOMER, {
    client: apolloClient,
    onCompleted: (data) => {
      console.log(data);
      toggle();
      getCustomers({
        projectID: params.id,
        currentPage: 1,
        pageSize: 10,
      });
      methods.reset();
    },
    onError: (error) => console.log(error),
  });

  const submit = async (data) => {
    // console.log("submited", data);

    await updateCustomerAction({
      variables: {
        id: customerID,
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          contactNumber: data.contactNumber,
        },
      },
    });
  };
  return (
    <>
      <Modal
        isOpen={isOpen}
        size="xl"
        centered
        toggle={mode === "view" ? toggle : false}
      >
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(submit)}
            className={commonStyles.formWrapper}
            style={{ padding: 0 }}
          >
            <ModalBody className={styles.modalBodyContainer}>
              Customer Details
              {mode === "view" && (
                <div
                  className={commonStyles.formEditDetail}
                  style={{ margin: 0 }}
                >
                  <button onClick={() => setMode("edit")}>
                    <GrEdit size={16} />
                    Edit Details
                  </button>
                </div>
              )}
              <div className={styles.addressContainer}>
                {loadingForSelectedCustomer ? (
                  <Loading />
                ) : (
                  <CustomerForm viewMode={mode === "view"} />
                )}
              </div>
              {mode === "edit" && (
                <div style={{ display: "flex", marginTop: "auto" }}>
                  <button
                    type="button"
                    className={commonStyles.formCancelBtn}
                    onClick={() => {
                      toggle();
                      methods.reset();
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={commonStyles.formCreateBtn}
                    style={{ marginLeft: "auto" }}
                  >
                    Save
                  </button>
                </div>
              )}
            </ModalBody>
          </form>
        </FormProvider>
      </Modal>
    </>
  );
};

export default ViewAndEditCustomer;
