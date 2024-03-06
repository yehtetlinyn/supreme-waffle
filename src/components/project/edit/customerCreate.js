import React from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import CustomerForm from "./customerForm";
import { FormProvider, useForm } from "react-hook-form";

import commonStyles from "../../styles/commonStyles.module.css";
import styles from "../project.module.css";
import { useMutation } from "@apollo/client";
import { CREATE_CUSTOMER } from "@/graphql/mutations/customer";
import apolloClient from "@/lib/apolloClient";
import { useParams } from "next/navigation";
import useCustomerStore from "@/store/customer";
import { shallow } from "zustand/shallow";
import useProjectStore from "@/store/project";

const CustomerCreate = ({ isOpen, toggle }) => {
  const methods = useForm();
  const params = useParams();

  const { getCustomers } = useCustomerStore(
    (state) => ({ getCustomers: state.getCustomers }),
    shallow
  );

  const { getProjectByID } = useProjectStore(
    (state) => ({
      getProjectByID: state.getProjectByID,
    }),
    shallow
  );

  const [createCustomerAction] = useMutation(CREATE_CUSTOMER, {
    client: apolloClient,
    onCompleted: (data) => {
      console.log(data);
      getCustomers({
        projectID: params.id,
        currentPage: 1,
        pageSize: 10,
      });
      toggle();
      methods.reset();
    },
    onError: (error) => console.log(error),
  });

  const submit = async (data) => {
    // console.log("submited", data);

    await createCustomerAction({
      variables: {
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          contactNumber: data.contactNumber,
          project: params.id,
        },
      },
    });

    //Update project data by refetch project
    await getProjectByID({
      id: params?.id,
      deleted: false,
    });
  };
  return (
    <>
      <Modal isOpen={isOpen} size="xl" centered>
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(submit)}
            className={commonStyles.formWrapper}
            style={{ padding: 0 }}
          >
            <ModalBody className={styles.modalBodyContainer}>
              Customer Details
              <div className={styles.addressContainer}>
                <CustomerForm />
              </div>
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
                  Add
                </button>
              </div>
            </ModalBody>
          </form>
        </FormProvider>
      </Modal>
    </>
  );
};

export default CustomerCreate;
