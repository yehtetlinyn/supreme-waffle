import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import CreateProjectForm from "../forms/createForm";

import commonStyles from "../../styles/commonStyles.module.css";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import useProjectStore from "@/store/project";
import { shallow } from "zustand/shallow";
import { useEffect } from "react";
import Loading from "@/components/modals/loading";
import { useMutation } from "@apollo/client";
import { UPDATE_PROJECT } from "@/graphql/mutations/project";
import apolloClient from "@/lib/apolloClient";
import { uploadFile } from "@/utils/helpers";
import usePageStore from "@/store/pageStore";

const ProjectContent = () => {
  const params = useParams();
  const router = useRouter();

  const mode = params.action;
  const projectID = params.id;

  const methods = useForm({
    defaultValues: {},
  });

  const isDirty = methods.formState.isDirty;

  useEffect(() => {
    usePageStore.setState({ isFormDirty: isDirty });
  }, [isDirty]);

  const { getProjectByID, projectData, loading } = useProjectStore(
    (state) => ({
      getProjectByID: state.getProjectByID,
      projectData: state.projectData,
      loading: state.loading,
    }),
    shallow
  );

  //Set Default values to form
  useEffect(() => {
    methods.reset({
      name: projectData?.[0]?.name,
      description: projectData?.[0]?.description,
      addresses: projectData?.[0]?.addresses,
      tags: {
        value: projectData?.[0]?.tags?.[0]?.id,
        label: projectData?.[0]?.tags?.[0]?.name,
      },
      document: projectData?.[0]?.document?.[0],
    });
  }, [projectData]);

  const [updateProjectAction] = useMutation(UPDATE_PROJECT, {
    client: apolloClient,
    onCompleted: (data) => {
      console.log("updatedProject", data);
      router.replace(`/settings/project/view/${params.id}?tab=project`);
    },
    onError: (error) => console.log("error", error),
  });

  const submit = async (data) => {
    // console.log("submiteddata", data);

    const uploadedDocumentID = await uploadFile(data.document);

    const updateVariables = {
      name: data.name,
      description: data.description,
      addresses: data.addresses?.map((add) => {
        const { __typename, ...rest } = add;
        return rest;
      }),
      tags: data.tags ? data.tags?.value : undefined,
      document: uploadedDocumentID,
    };

    await updateProjectAction({
      variables: {
        id: params.id,
        data: updateVariables,
      },
    });

    await getProjectByID({
      id: params.id,
      deleted: false,
    });
  };

  const onCancelClick = () => {
    if (isDirty) {
      useProjectStore.setState({
        leaveRedirectLink: `/settings/project/view/${params.id}?tab=project`,
      });
      usePageStore.setState({ leaveModal: true });
    } else {
      router.push(`/settings/project/view/${params.id}?tab=project`);
    }
  };

  if (loading) {
    return (
      <div>
        <Loading />
      </div>
    );
  } else {
    return (
      <>
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(submit)}
            className={commonStyles.formWrapper}
          >
            <div style={{ overflow: "hidden scroll" }}>
              <CreateProjectForm />
            </div>

            {mode === "edit" && (
              <div
                style={{
                  display: "flex",
                  marginTop: "auto",
                  padding: "20px 0 0 0",
                }}
              >
                <button
                  type="button"
                  className={commonStyles.formCancelBtn}
                  onClick={onCancelClick}
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
          </form>
        </FormProvider>
      </>
    );
  }
};

export default ProjectContent;
