import React from "react";
import { FormProvider, useForm } from "react-hook-form";

import commonStyles from "../../styles/commonStyles.module.css";
import DespatchForm from "../forms/despatchForm";
import useDespatchStore from "@/store/despatch";
import { useEffect } from "react";
import { shallow } from "zustand/shallow";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";
import {
  CREATE_DESPATCHTYPE,
  DELETE_DESPATCHTYPE,
  UPDATE_DESPATCHTYPE,
} from "@/graphql/mutations/despatch";
import apolloClient from "@/lib/apolloClient";
import { useState } from "react";
import useProjectStore from "@/store/project";
import usePageStore from "@/store/pageStore";

const DespatchEdit = () => {
  const params = useParams();
  const router = useRouter();
  const methods = useForm();
  const isDirty = methods.formState.isDirty;
  const watchDespatches = methods.watch("despatches");
  const [deleted, setDeleted] = useState([]);
  const { getDespatches, despatchData, loading } = useDespatchStore(
    (state) => ({
      getDespatches: state.getDespatches,
      despatchData: state.despatchData,
      loading: state.loading,
    }),
    shallow
  );

  const { getProjectByID } = useProjectStore(
    (state) => ({
      getProjectByID: state.getProjectByID,
    }),
    shallow
  );

  useEffect(() => {
    getDespatches({
      projectID: params?.id,
      limit: -1,
    });
  }, []);

  useEffect(() => {
    if (despatchData.length > 0) {
      const initialValue = {
        despatches: despatchData?.map((despatch) => ({
          id: despatch.id,
          name: despatch.name,
          code: despatch.code,
          headcount: despatch.headcountNumber,
          duration: despatch.durationInHours,
          description: despatch.description,
          tasks: despatch.tasks?.map((task) => ({
            Name: task.Name,
            Steps: task.Steps?.map((step) => ({
              Serial: step.Serial,
              Description: step.Description,
              Status: { value: step.Status, label: step.Status },
            })),
          })),
        })),
      };
      methods.reset(initialValue);
    } else {
      methods.reset({
        despatches: [
          {
            tasks: [
              {
                Steps: [{}],
              },
            ],
          },
        ],
      });
    }
  }, [despatchData]);

  useEffect(() => {
    usePageStore.setState({ isFormDirty: isDirty });
  }, [isDirty]);

  const [createDespatchAction] = useMutation(CREATE_DESPATCHTYPE, {
    client: apolloClient,
    onError: (error) => console.log("error", error),
  });

  const [updateDespatchAction] = useMutation(UPDATE_DESPATCHTYPE, {
    client: apolloClient,
    onError: (error) => console.log("error", error),
  });

  const [deleteDespatchAction] = useMutation(DELETE_DESPATCHTYPE, {
    client: apolloClient,
    onError: (error) => console.log("error", error),
  });

  const prepareForBackend = (data) => {
    return {
      project: params.id,
      name: data.name,
      code: data.code,
      headcountNumber: parseFloat(data.headcount),
      durationInHours: data.duration,
      description: data.description,
      tasks: data.tasks?.map((task) => ({
        Name: task.Name,
        Steps: task.Steps?.map((step) => ({
          Serial: step.Serial,
          Description: step.Description,
          Status: step.value,
        })),
      })),
    };
  };

  const submit = async (data) => {
    const oldDespatches = watchDespatches?.filter((desp) => desp?.id);
    const newDespatches = watchDespatches?.filter((desp) => !desp.id);

    await Promise.all(
      oldDespatches?.map(async (desp) => {
        const updatedData = prepareForBackend(desp);
        await updateDespatchAction({
          variables: {
            id: +desp.id,
            data: updatedData,
          },
        });
      })
    );

    await Promise.all(
      newDespatches?.map(async (desp) => {
        const newData = prepareForBackend(desp);
        await createDespatchAction({
          variables: {
            data: newData,
          },
        });
      })
    );

    await Promise.all(
      deleted?.map(async (id) => {
        await deleteDespatchAction({
          variables: {
            id: id,
          },
        });
      })
    );

    //Update project data by refetch project
    await getProjectByID({
      id: params?.id,
      deleted: false,
    });

    //Go back to view mode
    router.replace(`/settings/project/view/${params.id}?tab=despatchTypes`);
  };

  const onCancelClick = () => {
    if (isDirty) {
      useProjectStore.setState({
        leaveRedirectLink: `/settings/project/view/${params.id}?tab=despatchTypes`,
      });
      usePageStore.setState({ leaveModal: true });
    } else {
      router.push(`/settings/project/view/${params.id}?tab=despatchTypes`);
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(submit)}
        className={commonStyles.formWrapper}
      >
        <DespatchForm setDeleted={setDeleted} />
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
      </form>
    </FormProvider>
  );
};

export default DespatchEdit;
