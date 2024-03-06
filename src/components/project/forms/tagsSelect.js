import React from "react";
import { useEffect } from "react";

import useTagStore from "@/store/tag";
import { shallow } from "zustand/shallow";
import { useParams, useSearchParams } from "next/navigation";
import CreatableSelectBox from "@/components/selectBox/creatableSelectBox";
import { useMutation } from "@apollo/client";
import { CREATE_TAG } from "@/graphql/mutations/tag";
import apolloClient from "@/lib/apolloClient";

const TagsSelect = ({ value, onChange, formErrors }) => {
  const params = useParams();
  const viewMode = params.action === "view";
  const { getTagOptions, tagOptions, loading } = useTagStore(
    (state) => ({
      getTagOptions: state.getTagOptions,
      tagOptions: state.tagOptions,
      loading: state.loading,
    }),
    shallow
  );

  useEffect(() => {
    getTagOptions();
  }, []);

  const createOption = (value, label) => {
    return { value: value, label };
  };

  const [createTagAction] = useMutation(CREATE_TAG, {
    client: apolloClient,
  });

  const handleCreate = async (createdLabel) => {
    const createdTag = await createTagAction({
      variables: {
        data: {
          name: createdLabel,
          projects: params.id,
        },
      },
    });

    //Update the tag options
    await getTagOptions();

    //Set selected tag with new created values
    onChange(createOption(createdTag?.data?.createTag.data?.id, createdLabel));
  };

  if (!loading) {
    return (
      <CreatableSelectBox
        placeholder="Select tags"
        options={tagOptions}
        onChange={onChange}
        value={value}
        crudForm
        formErrors={formErrors}
        view={viewMode}
        handleCreate={handleCreate}
      />
    );
  }
};

export default TagsSelect;
