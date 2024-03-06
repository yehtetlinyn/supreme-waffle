import { create } from "zustand";
import dayjs from "dayjs";
import { produce } from "immer";
import { v4 as uuid } from "uuid";
import apolloClient from "@/lib/apolloClient";
import { GET_NEWS } from "@/graphql/queries/news";
import { renderFormatDate, renderFormatDateTime } from "@/utils/helpers";

const storeState = {
  fetch: null,
  newsData: null,
  newsId: null,
  newsImages: [],
  newsImageIds: [],
  imagePreviews: [],
  uploadedFileIds: [],

  total: 0,
  pageCount: 0,
  loading: false,
  newsPin: false,
  noExpiry: false,
};

const newsStore = (set, get) => ({
  ...storeState,
  handleRefresh: () => set({ fetch: uuid() }),

  handlePinNews: (isPinned) => set({ newsPin: isPinned }),
  handleNoExpiry: (noExpired) => set({ noExpiry: noExpired }),

  setImagePreviews: (previewImages) => {
    set((state) =>
      produce(state, (draft) => {
        draft.imagePreviews.push(...previewImages);
      })
    );
  },
  setUploadedFileIds: (uploadedIds) => {
    set((state) =>
      produce(state, (draft) => {
        draft.uploadedFileIds.push(...uploadedIds);
      })
    );
  },

  removeExistingImages: (index) => {
    set((state) =>
      produce(state, (draft) => {
        draft.newsImages.splice(index, 1);
      })
    );

    const { newsImages } = get();
    const newsImageIds = newsImages.map((data) => data.id);
    set(
      produce((draft) => {
        draft.newsImageIds = newsImageIds;
      })
    );
  },
  removeExistingOneImage: () => {
    set((state) =>
      produce(state, (draft) => {
        draft.newsImages = [];
        draft.newsImageIds = null;
      })
    );
  },
  removeUploadedImages: (index) => {
    set((state) =>
      produce(state, (draft) => {
        draft.uploadedFileIds.splice(index, 1);
        draft.imagePreviews.splice(index, 1);
      })
    );
  },

  getNewsById: async (newsId) => {
    try {
      set({ loading: true });
      const {
        data: { pluralNews: news },
      } = await apolloClient.query({
        fetchPolicy: "network-only",
        query: GET_NEWS,
        variables: { id: parseInt(newsId) },
      });

      const newsData = news.data.map((item) => {
        const moreImageIds = item.attributes.media.data.map((data) => data.id);
        const moreImages = item.attributes.media.data.map((data) => data);
        const numberOfNewsImages = moreImages?.length;

        const publishDate = item.attributes.publishDate;
        const endDate = item.attributes.endDate;
        const noExpiry = publishDate && !endDate;

        return {
          id: item.id,
          title: item.attributes.title,
          content: item.attributes.content,
          pinned: item.attributes.pinned,
          newsImageIds: numberOfNewsImages >= 1 ? moreImageIds : "",
          newsImages:
            numberOfNewsImages > 1
              ? moreImages
              : numberOfNewsImages === 1
              ? item.attributes.media.data[0]
              : null,
          publishDate: publishDate,
          endDate: endDate,
          noExpiry: noExpiry,
        };
      });

      newsData[0]?.noExpiry && set({ noExpiry: true });

      set({
        newsData: newsData[0],
        newsImages: newsData[0]?.newsImages,
        newsImageIds: newsData[0]?.newsImageIds,
        newsId: newsData[0]?.id,
        loading: false,
      });
    } catch (error) {
      set({ loading: false });
      console.log("error", error);
    }
  },

  getNews: async ({ filterInput, currentPage, pageSize }) => {
    try {
      set({ loading: true });
      const {
        data: { pluralNews: news },
      } = await apolloClient.query({
        fetchPolicy: "network-only",
        query: GET_NEWS,
        variables: {
          title: filterInput || undefined,
          pageNum: currentPage,
          pageSize: pageSize,
        },
      });

      const newsData = news.data.map((item) => {
        const publishDate = item.attributes.publishDate;
        const endDate = item.attributes.endDate;

        const schedule =
          publishDate && !endDate
            ? renderFormatDate(publishDate)
            : !publishDate && endDate
            ? renderFormatDate(endDate)
            : `${renderFormatDate(publishDate)} - ${renderFormatDate(endDate)}`;

        return {
          id: item.id,
          title: item.attributes.title,
          content: item.attributes.content,
          pinned: item.attributes.pinned,
          publishDate: publishDate,
          endDate: endDate,
          schedule: schedule,
          createdAt: renderFormatDateTime(item.attributes.createdAt),
        };
      });

      set({
        newsData: newsData,
        total: news.meta?.pagination?.total,
        pageCount: news.meta?.pagination?.pageCount,
        loading: false,
      });
    } catch (error) {
      set({ loading: false });
      console.log("error", error);
    }
  },

  resetNewsStates: () => {
    set(
      produce((draft) => {
        draft.noExpiry = false;
        draft.newsImages = [];
        draft.newsImageIds = [];
        draft.imagePreviews = [];
        draft.uploadedFileIds = [];
      })
    );
  },
});

const useNewsStore = create(newsStore);
export default useNewsStore;
