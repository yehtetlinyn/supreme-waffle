"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import useAnnouncementStore from "@/store/announceStore";
import Loading from "@/components/modals/loading";
import FormContents from "../forms/page";

const ViewForm = (props) => {
  const params = useParams();

  const {
    announceId,
    loading,
    noExpiry,
    announcementData,
    getAnnouncementById,
    handleNoExpiry,
    resetAnnouncementStates,
  } = useAnnouncementStore();

  const [isPinned, setIsPinned] = useState(false);
  const [publishDate, setPublishDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

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
    resetAnnouncementStates();
  }, []);

  const handlePinChange = () => {
    if (isPinned) {
      setIsPinned(true);
    } else {
      setIsPinned(false);
    }
  };

  const handleIsExpired = () => {
    if (noExpiry) {
      handleNoExpiry(true);
    } else {
      handleNoExpiry(false);
    }
  };

  return (
    <>
      {loading || (!announcementData && <Loading />) || (
        <FormContents
          formParams={"announcement-view"}
          actionMode={"view"}
          isPinned={isPinned}
          publishDate={publishDate}
          endDate={endDate}
          noExpiry={noExpiry}
          callBackData={announcementData}
          handlePinCallBack={handlePinChange}
          handleIsExpiredCallBack={handleIsExpired}
        />
      )}
    </>
  );
};

export default ViewForm;
