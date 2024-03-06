"use client";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useParams, useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";
import apolloClient from "@/lib/apolloClient";
import { UPDATE_ANNOUNCEMENTS } from "@/graphql/mutations/announcement";
import Loading from "@/components/modals/loading";
import useAnnouncementStore from "@/store/announceStore";
import FormContents from "../forms/page";
import { getFormParams } from "@/utils/helpers";

const EditForm = (props) => {
  const params = useParams();
  const router = useRouter();

  const {
    loading,
    announceId,
    noExpiry,
    announcementData,
    handleNoExpiry,
    getAnnouncementById,
    handlePinAnnouncement,
    resetAnnouncementStates,
  } = useAnnouncementStore((state) => ({
    loading: state.loading,
    announceId: state.announceId,
    noExpiry: state.noExpiry,
    announcementData: state.announcementData,
    handleNoExpiry: state.handleNoExpiry,
    getAnnouncementById: state.getAnnouncementById,
    handlePinAnnouncement: state.handlePinAnnouncement,
    resetAnnouncementStates: state.resetAnnouncementStates,
  }));

  const [isPinned, setIsPinned] = useState(false);
  const [publishDate, setPublishDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const fetchAnnouncementData = async () => {
    if (announcementData) {
      props.setAnnouncementTitle(announcementData?.title);
      setIsPinned(announcementData?.pinned);
      setPublishDate(announcementData?.publishDate);
      setEndDate(announcementData?.endDate);
    }
  };

  useEffect(() => {
    getAnnouncementById(params?.id || announceId);
  }, []);

  useEffect(() => {
    fetchAnnouncementData();
  }, [announcementData]);

  useEffect(() => {
    handlePinAnnouncement(isPinned);
    handleNoExpiry(noExpiry);
  }, []);

  useEffect(() => {
    resetAnnouncementStates();
  }, []);

  const formatUpdateDate = (date) => {
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

  const [updateAnnouncementAction, { loading: updateLoading }] = useMutation(
    UPDATE_ANNOUNCEMENTS,
    {
      client: apolloClient,
      onCompleted: (data) => {
        if (data) {
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
    "announcement-edit"
  );

  const submitData = async (data) => {
    setFormSubmitted(true);

    const { title, description } = data;

    await updateAnnouncementAction({
      variables: {
        id: params.id,
        data: {
          title: title,
          content: description,
          pinned: isPinned,
          publishDate:
            noExpiry && publishDate
              ? formatUpdateDate(publishDate)
              : noExpiry
              ? formatUpdateDate(new Date())
              : formatUpdateDate(publishDate),
          endDate: noExpiry ? null : formatUpdateDate(endDate),
        },
      },
    });
  };

  return (
    <>
      {loading || (!announcementData && <Loading />) || (
        <FormContents
          formParams={formParams}
          actionMode={"edit"}
          disabled={formSubmitted}
          isPinned={isPinned}
          publishDate={publishDate}
          endDate={endDate}
          startDateRequired={startDateRequired}
          endDateRequired={endDateRequired}
          noExpiry={noExpiry}
          callBackData={announcementData}
          submitDataCallBack={submitData}
          handlePinCallBack={handlePinChange}
          handlePublishDateCallBack={handlePublishDateChange}
          handleEndDateCallBack={handleEndDateChange}
          handleIsExpiredCallBack={handleIsExpired}
        />
      )}
    </>
  );
};

export default EditForm;
