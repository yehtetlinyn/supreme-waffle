"use client";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useParams, useRouter } from "next/navigation";
import apolloClient from "@/lib/apolloClient";
import { useMutation } from "@apollo/client";
import { UPDATE_NEWS } from "@/graphql/mutations/news";
import Loading from "@/components/modals/loading";
import FormContents from "@/components/announcement/forms/page";
import useNewsStore from "@/store/newsStore";
import { getFormParams } from "@/utils/helpers";

const EditForm = (props) => {
  const params = useParams();
  const router = useRouter();

  const {
    loading,
    newsId,
    noExpiry,
    newsData,
    newsImages,
    newsImageIds,
    uploadedFileIds,
    getNewsById,
    handlePinNews,
    handleNoExpiry,
    resetNewsStates,
  } = useNewsStore((state) => ({
    loading: state.loading,
    newsId: state.newsId,
    noExpiry: state.noExpiry,
    newsData: state.newsData,
    newsImages: state.newsImages,
    newsImageIds: state.newsImageIds,
    uploadedFileIds: state.uploadedFileIds,
    getNewsById: state.getNewsById,
    handlePinNews: state.handlePinNews,
    handleNoExpiry: state.handleNoExpiry,
    resetNewsStates: state.resetNewsStates,
  }));

  const [isPinned, setIsPinned] = useState(false);
  const [publishDate, setPublishDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);

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
    handlePinNews(isPinned);
    handleNoExpiry(noExpiry);
  }, []);

  useEffect(() => {
    resetNewsStates();
  }, []);

  const formatUpdateDate = (date) => {
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

  const [updateNewsAction, { loading: updateLoading }] = useMutation(
    UPDATE_NEWS,
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
    "news-edit"
  );

  const submitData = async (data) => {
    setFormSubmitted(true);

    const { title, description } = data;
    const imageIds = newsImageIds
      ? [...newsImageIds, ...uploadedFileIds]
      : [...uploadedFileIds];

    await updateNewsAction({
      variables: {
        id: params.id,
        data: {
          title: title,
          content: description,
          pinned: isPinned,
          media: imageIds,
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
      {loading || (!newsData && <Loading />) || (
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
          callBackData={newsData}
          newsImages={newsImages}
          enableNewsPageMode={true}
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
