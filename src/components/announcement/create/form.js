"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { useMutation } from "@apollo/client";
import apolloClient from "@/lib/apolloClient";
import { CREATE_ANNOUNCEMENTS } from "@/graphql/mutations/announcement";
import useAnnouncementStore from "@/store/announceStore";
import useAuthStore from "@/store/authStore";
import FormContents from "../forms/page";
import { getFormParams } from "@/utils/helpers";

const CreateForm = () => {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const {
    noExpiry,
    handleNoExpiry,
    handlePinAnnouncement,
    resetAnnouncementStates,
  } = useAnnouncementStore((state) => ({
    noExpiry: state.noExpiry,
    handleNoExpiry: state.handleNoExpiry,
    handlePinAnnouncement: state.handlePinAnnouncement,
    resetAnnouncementStates: state.resetAnnouncementStates,
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
    handlePinAnnouncement(!isPinned);
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

  const [createAnnouncementAction, { loading }] = useMutation(
    CREATE_ANNOUNCEMENTS,
    {
      client: apolloClient,
      onCompleted: (data) => {
        const isCompleted = (!startDateRequired || !endDateRequired) && data;
        if (isCompleted) {
          router.back();
        }
      },
      onError: (error) => {
        console.log("error", error);
      },
    }
  );

  const startDateRequired = !publishDate && endDate && !noExpiry;
  const endDateRequired = publishDate && !endDate && !noExpiry;
  const formParams = getFormParams(
    startDateRequired,
    endDateRequired,
    "announcement-create"
  );

  const submitData = async (data) => {
    setFormSubmitted(true);

    const { title, description } = data;

    await createAnnouncementAction({
      variables: {
        data: {
          title: title,
          content: description,
          pinned: isPinned,
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
    handlePinAnnouncement(isPinned);
    handleNoExpiry(noExpiry);
  }, []);

  useEffect(() => {
    resetAnnouncementStates();
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
