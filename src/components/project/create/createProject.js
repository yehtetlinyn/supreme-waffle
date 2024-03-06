"use client";
import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { CREATE_PROJECT } from "@/graphql/mutations/project";
import apolloClient from "@/lib/apolloClient";

import commonStyles from "../../styles/commonStyles.module.css";

import CreateProjectForm from "../forms/createForm";
import CustomBreadcrumb from "@/components/manageLayout/breadcrumb";
import { uploadFile } from "@/utils/helpers";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ConfirmationModal from "@/components/modals/confirmation";

const CreateProject = () => {
  const router = useRouter();
  const breadcrumbList = ["Project", "Create New Project"];
  const methods = useForm({
    defaultValues: {},
  });

  const [successModal, setSuccessModal] = useState(false);
  const [createdProjectID, setCreatedProjectID] = useState("");

  const [createProjectAction] = useMutation(CREATE_PROJECT, {
    client: apolloClient,
    onCompleted: (data) => {
      setCreatedProjectID(data?.createProject.data?.id);
      setSuccessModal(true);
    },
    onError: (error) => console.log("error", error),
  });

  const submit = async (data) => {
    console.log("submitedData", data);

    const uploadedDocumentID = await uploadFile(data.document);

    const createVariables = {
      name: data.name,
      description: data.description,
      addresses: data.addresses,
      tags: data.tags ? data.tags?.value : undefined,
      document: uploadedDocumentID,
      deleted: false,
    };

    await createProjectAction({
      variables: {
        data: createVariables,
      },
    });
  };

  const successToggle = () => {
    router.push("/settings/project");
    setSuccessModal(false);
  };

  return (
    <>
      <ConfirmationModal
        isOpen={successModal}
        toggle={successToggle}
        modalTitle={"Confirmation Message"}
        modalMsg={
          "Project creation is successful .Do you wish to configuring the Project ?"
        }
        actionBtnProps="Continue"
        handleClick={() =>
          router.push(`/settings/project/view/${createdProjectID}?tab=project`)
        }
        enableModalFooter={false}
      />
      <CustomBreadcrumb
        title="Project"
        breadcrumbList={breadcrumbList}
        handleBreadcrumbClick={() => {
          router.push("/settings/project");
        }}
      />
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(submit)}
          className={commonStyles.formWrapper}
        >
          <div style={{ overflow: "hidden scroll" }}>
            <CreateProjectForm />
          </div>
          <div style={{ display: "flex", marginTop: "auto" }}>
            <button
              type="button"
              className={commonStyles.formCancelBtn}
              onClick={() => router.push("/settings/project")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={commonStyles.formCreateBtn}
              style={{ marginLeft: "auto" }}
            >
              Create
            </button>
          </div>
        </form>
      </FormProvider>
    </>
  );
};

export default CreateProject;
