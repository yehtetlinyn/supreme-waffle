"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import useNewsStore from "@/store/newsStore";
import Loading from "@/components/modals/loading";
import FormContents from "@/components/announcement/forms/page";

const ViewForm = (props) => {
  const params = useParams();

  const {
    newsId,
    loading,
    noExpiry,
    newsData,
    newsImages,
    getNewsById,
    handleNoExpiry,
    resetNewsStates,
  } = useNewsStore((state) => ({
    newsId: state.newsId,
    loading: state.loading,
    noExpiry: state.noExpiry,
    newsData: state.newsData,
    newsImages: state.newsImages,
    getNewsById: state.getNewsById,
    handleNoExpiry: state.handleNoExpiry,
    resetNewsStates: state.resetNewsStates,
  }));

  const [isPinned, setIsPinned] = useState(false);
  const [publishDate, setPublishDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const fetchNewsData = async () => {
    if (newsData) {
      props.setNewsTitle(newsData?.title);
      setIsPinned(newsData?.pinned);
      setPublishDate(newsData?.publishDate);
      setEndDate(newsData?.endDate);
    }
  };

  useEffect(() => {
    getNewsById(params?.id || newsId);
  }, []);

  useEffect(() => {
    fetchNewsData();
  }, [newsData]);

  useEffect(() => {
    resetNewsStates();
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
      {loading || (!newsData && <Loading />) || (
        <FormContents
          formParams={"announcement-view"}
          actionMode={"view"}
          isPinned={isPinned}
          publishDate={publishDate}
          endDate={endDate}
          noExpiry={noExpiry}
          callBackData={newsData}
          newsImages={newsImages}
          enableNewsPageMode={true}
          handlePinCallBack={handlePinChange}
          handleIsExpiredCallBack={handleIsExpired}
        />
      )}
    </>
  );
};

export default ViewForm;
