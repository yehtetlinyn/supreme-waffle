import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import DespatchForm from "../forms/despatchForm";
import useDespatchStore from "@/store/despatch";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import commonStyles from "../../styles/commonStyles.module.css";
import { shallow } from "zustand/shallow";
import Link from "next/link";
import { GrEdit } from "react-icons/gr";

const DespatchView = () => {
  const router = useRouter();
  const params = useParams();
  const methods = useForm();
  const { getDespatches, despatchData, loading } = useDespatchStore(
    (state) => ({
      getDespatches: state.getDespatches,
      despatchData: state.despatchData,
      loading: state.loading,
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

  return (
    <FormProvider {...methods}>
      <form className={commonStyles.formWrapper}>
        {}
        <div className={commonStyles.formEditDetail}>
          <button
            type="button"
            onClick={() =>
              router.replace(
                `/settings/project/edit/${params.id}?tab=despatchTypes`
              )
            }
          >
            <GrEdit size={16} />
            Edit Details
          </button>
        </div>
        <DespatchForm />
      </form>
    </FormProvider>
  );
};

export default DespatchView;
