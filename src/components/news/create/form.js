"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import apolloClient from "@/lib/apolloClient";

import { CREATE_NEWS } from "@/graphql/mutations/news";
import { useMutation } from "@apollo/client";
import useNewsStore from "@/store/newsStore";
import useAuthStore from "@/store/authStore";
import FormContents from "@/components/announcement/forms/page";
import { getFormParams } from "@/utils/helpers";

const CreateForm = () => {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const {
    noExpiry,
    newsImageIds,
    uploadedFileIds,
    handlePinNews,
    handleNoExpiry,
    resetNewsStates,
  } = useNewsStore((state) => ({
    noExpiry: state.noExpiry,
    newsImageIds: state.newsImageIds,
    uploadedFileIds: state.uploadedFileIds,
    handlePinNews: state.handlePinNews,
    handleNoExpiry: state.handleNoExpiry,
    resetNewsStates: state.resetNewsStates,
  }));

  const [publishDate, setPublishDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isPinned, setIsPinned] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const formatCreateDate = (date) => {
    if (date) {
      return dayjs(date).format("YYYY-MM-DD");
    } else {
      return null;
    }
  };

  const handlePinChange = () => {
    handlePinNews(!isPinned);
    setIsPinned(!isPinned);
  };

  const handleIsExpired = () => {
    handleNoExpiry(!noExpiry);
  };

  const handlePublishDateChange = (date) => {
    setPublishDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const [createNewsAction, { loading }] = useMutation(CREATE_NEWS, {
    client: apolloClient,
    onCompleted: (data) => {
      if (data) {
        router.back();
      }
    },
    onError: (error) => {
      console.log("error", error);
    },
  });

  const startDateRequired = !publishDate && endDate && !noExpiry;
  const endDateRequired = publishDate && !endDate && !noExpiry;
  const formParams = getFormParams(
    startDateRequired,
    endDateRequired,
    "news-create"
  );

  const submitData = async (data) => {
    setFormSubmitted(true);

    const { title, description } = data;
    const imageIds = [...newsImageIds, ...uploadedFileIds];

    await createNewsAction({
      variables: {
        data: {
          title: title,
          content: description,
          pinned: isPinned,
          media: imageIds,
          createdByProfile: parseInt(user?.id),
          publishDate:
            noExpiry && publishDate
              ? formatCreateDate(publishDate)
              : noExpiry
              ? formatCreateDate(new Date())
              : formatCreateDate(publishDate),
          endDate: noExpiry ? null : formatCreateDate(endDate),
        },
      },
    });
  };

  useEffect(() => {
    handlePinNews(isPinned);
    handleNoExpiry(noExpiry);
  }, []);

  useEffect(() => {
    resetNewsStates();
  }, []);

  return (
    <>
      <FormContents
        formParams={formParams}
        actionMode={"create"}
        disabled={formSubmitted}
        isPinned={isPinned}
        publishDate={publishDate}
        endDate={endDate}
        startDateRequired={startDateRequired}
        endDateRequired={endDateRequired}
        noExpiry={noExpiry}
        enableNewsPageMode={true}
        submitDataCallBack={submitData}
        handlePinCallBack={handlePinChange}
        handlePublishDateCallBack={handlePublishDateChange}
        handleEndDateCallBack={handleEndDateChange}
        handleIsExpiredCallBack={handleIsExpired}
      />
    </>
  );
};

export default CreateForm;
