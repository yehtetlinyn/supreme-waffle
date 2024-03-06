import React from "react";
import { FormProvider, useForm } from "react-hook-form";

import commonStyles from "../../styles/commonStyles.module.css";
import { useEffect } from "react";
import { shallow } from "zustand/shallow";
import { useParams, usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useMutation } from "@apollo/client";
import apolloClient from "@/lib/apolloClient";
import { useState } from "react";
import useProjectStore from "@/store/project";
import useIssueTypeStore from "@/store/issueType";
import {
  CREATE_ISSUETYPE,
  DELETE_ISSUETYPE,
  UPDATE_ISSUETYPE,
} from "@/graphql/mutations/issueType";
import IssueTypesForm from "../forms/issueTypesForm";
import usePageStore from "@/store/pageStore";

const IssueTypesEdit = () => {
  const params = useParams();
  const router = useRouter();
  const methods = useForm();
  const isDirty = methods.formState.isDirty;
  const watchIssueTypes = methods.watch("issueTypes");
  const [deleted, setDeleted] = useState([]);
  const { getIssueTypes, issueTypeData, loading } = useIssueTypeStore(
    (state) => ({
      getIssueTypes: state.getIssueTypes,
      issueTypeData: state.issueTypeData,
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
    getIssueTypes({
      projectID: params?.id,
      limit: -1,
    });
  }, []);

  useEffect(() => {
    if (issueTypeData.length > 0) {
      const initialValue = {
        issueTypes: issueTypeData?.map((issueType) => ({
          id: issueType.id,
          name: issueType.name,
          impact: { value: issueType.impact, label: issueType.impact },
          priority: { value: issueType.priority, label: issueType.priority },
          description: issueType.description,
        })),
      };
      methods.reset(initialValue);
    } else {
      methods.reset({
        issueTypes: [{}],
      });
    }
  }, [issueTypeData]);

  useEffect(() => {
    usePageStore.setState({ isFormDirty: isDirty });
  }, [isDirty]);

  const [createIssueTypeAction] = useMutation(CREATE_ISSUETYPE, {
    client: apolloClient,
    onError: (error) => console.log("error", error),
  });

  const [updateIssueTypeAction] = useMutation(UPDATE_ISSUETYPE, {
    client: apolloClient,
    onError: (error) => console.log("error", error),
  });

  const [deleteIssueTypeAction] = useMutation(DELETE_ISSUETYPE, {
    client: apolloClient,
    onError: (error) => console.log("error", error),
  });

  const prepareForBackend = (data) => {
    return {
      projects: params.id,
      name: data.name,
      impact: data.impact?.value,
      priority: data.priority?.value,
      description: data.description,
    };
  };

  const submit = async (data) => {
    const oldIssueTypes = watchIssueTypes?.filter((desp) => desp?.id);
    const newIssueTypes = watchIssueTypes?.filter((desp) => !desp.id);

    await Promise.all(
      oldIssueTypes?.map(async (issue) => {
        const updatedData = prepareForBackend(issue);
        await updateIssueTypeAction({
          variables: {
            id: +issue.id,
            data: updatedData,
          },
        });
      })
    );

    await Promise.all(
      newIssueTypes?.map(async (issue) => {
        const newData = prepareForBackend(issue);
        await createIssueTypeAction({
          variables: {
            data: newData,
          },
        });
      })
    );

    await Promise.all(
      deleted?.map(async (id) => {
        await deleteIssueTypeAction({
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
    router.replace(`/settings/project/view/${params.id}?tab=issueTypes`);
  };

  const onCancelClick = () => {
    if (isDirty) {
      useProjectStore.setState({
        leaveRedirectLink: `/settings/project/view/${params.id}?tab=issueTypes`,
      });
      usePageStore.setState({ leaveModal: true });
    } else {
      router.push(`/settings/project/view/${params.id}?tab=issueTypes`);
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(submit)}
        className={commonStyles.formWrapper}
      >
        <IssueTypesForm setDeleted={setDeleted} />
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

export default IssueTypesEdit;
