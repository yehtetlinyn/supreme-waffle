import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";

import commonStyles from "../../styles/commonStyles.module.css";
import { shallow } from "zustand/shallow";
import { GrEdit } from "react-icons/gr";
import useIssueTypeStore from "@/store/issueType";
import IssueTypesForm from "../forms/issueTypesForm";

const IssueTypesView = () => {
  const router = useRouter();
  const params = useParams();
  const methods = useForm();
  const { getIssueTypes, issueTypeData, loading } = useIssueTypeStore(
    (state) => ({
      getIssueTypes: state.getIssueTypes,
      issueTypeData: state.issueTypeData,
      loading: state.loading,
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

  return (
    <FormProvider {...methods}>
      <form className={commonStyles.formWrapper}>
        {}
        <div className={commonStyles.formEditDetail}>
          <button
            type="button"
            onClick={() =>
              router.replace(
                `/settings/project/edit/${params.id}?tab=issueTypes`
              )
            }
          >
            <GrEdit size={16} />
            Edit Details
          </button>
        </div>
        <IssueTypesForm />
      </form>
    </FormProvider>
  );
};

export default IssueTypesView;
