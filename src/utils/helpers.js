import { API_URL } from "@/config";
const UPLOAD_URL = `${API_URL}/api/upload`;
const ZIP_UPLOAD_URL = `${API_URL}/api/upload-users`;
import dayjs from "dayjs";
import commonStyles from "@/components/styles/commonStyles.module.css";

export const uploadFile = async (fileInput) => {
  // file input must be a File object
  let authSession = JSON.parse(localStorage.getItem("authSession"));
  let { state } = authSession;

  try {
    if (!fileInput) {
      return null;
    } else {
      const formData = new FormData();
      formData.append("files", fileInput);
      const response = await fetch(UPLOAD_URL, {
        method: "POST",
        headers: {
          authorization: `Bearer ${state.token}`,
        },
        body: formData,
      });
      const json = await response.json();

      const fileId = json[0]?.id;

      console.log("File uploaded successfully. File ID:", fileId);
      return fileId;
    }
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
};

export const extractPageName = (pathname, index = 0) => {
  const parts = pathname.split("/");
  return parts[index];
};

// for finding index of collapse which has errors
const hasErrorMessage = (step) => {
  return (
    step &&
    step.step1 &&
    step.step1.message &&
    step.step1.type.includes("required")
  );
};

export const findIndexesOfErrorTasks = (tasks) => {
  const errorIndexes = [];
  for (let i = 0; i < tasks?.length; i++) {
    const task = tasks[i];
    if (
      (task && task.steps && task.steps.some(hasErrorMessage)) ||
      task?.name?.message
    ) {
      errorIndexes.push(i);
    } else {
      errorIndexes.push("");
    }
  }
  return errorIndexes;
};

export const findErrorIndexes = (errors) => {
  const indexes = [];
  for (let i = 0; i < errors?.length; i++) {
    if (errors?.[i]) {
      indexes.push(i);
    } else {
      indexes.push("");
    }
  }
  return indexes;
};

// check form params before submitting
export const getFormParams = (
  firstParamRequired = false,
  secondParamRequired = false,
  customFormValue
) => {
  const isRequired = firstParamRequired || secondParamRequired;
  return !isRequired ? customFormValue : "";
};

// check if an image file
export const isImageFile = (file) => {
  const imageTypes = ["image/jpeg", "image/png", "image/gif", "image/svg+xml"];
  return file && imageTypes.includes(file.type);
};

// check if duplicated ids or not
export const hasDuplicates = (array, property) => {
  const propertyCounts = {};
  let isAnyPropertyDuplicated = false;

  array?.forEach((item) => {
    const value = item[property];

    if (!propertyCounts[value]) {
      propertyCounts[value] = 1;
    } else {
      propertyCounts[value]++;
      isAnyPropertyDuplicated = true;
    }
  });

  return isAnyPropertyDuplicated;
};

// get current week as a label
export const getCurrentWeekLabel = (startingDay) => {
  const currentDay = dayjs(startingDay);
  const startOfMonth = currentDay.startOf("month");
  const weekNumber = Math.ceil(currentDay.diff(startOfMonth, "week", true));

  const startOfWeek = currentDay.subtract(currentDay.day() - 1, "day");
  const endOfWeek = startOfWeek.add(6, "day");

  return `Week ${weekNumber} - ${startOfWeek.format(
    "D MMM YYYY"
  )} to ${endOfWeek.format("D MMM YYYY")}`;
};

// get current week dates
export const getCurrentWeekDates = (startingDay) => {
  const currentDay = dayjs(startingDay);
  const startOfWeek = currentDay.subtract(currentDay.day() - 1, "day");
  const endOfWeek = startOfWeek.add(6, "day");

  return {
    startDate: startOfWeek.format("YYYY-MM-DD"),
    endDate: endOfWeek.format("YYYY-MM-DD"),
  };
};

// render date by week index
export const renderDate = (startingDay, index) => {
  return dayjs(startingDay).add(index, "day").format("YYYY-MM-DD");
};

// render day by week index
export const renderDay = (startingDay, index) => {
  return dayjs(startingDay).add(index, "day").format("dddd");
};

// render format date
export const renderFormatDate = (date) => {
  if (date) {
    return dayjs(date).format("DD-MM-YYYY");
  } else {
    return "-";
  }
};

// render format date and time
export const renderFormatDateTime = (date) => {
  if (date) {
    return dayjs(date).format("DD-MM-YYYY HH:mm A");
  } else {
    return "-";
  }
};

// render format time string
export const renderFormatTime = (timeString) => {
  const [hours, minutes] = timeString?.split(":")?.slice(0, 2);
  return `${hours}:${minutes}`;
};

// render format local time
export const renderFormatLocalTime = (dateTimeString) => {
  const date = new Date(dateTimeString);
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const options = {
    timeZone: userTimeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // Setting hour12 to false removes AM/PM
  };

  const formattedTime = date.toLocaleTimeString(undefined, options);
  return formattedTime;
};

// check time limit of the check-in and checkout
export const checkTimeLimit = (dateTimeString, status = "checkIn") => {
  const date = new Date(dateTimeString);
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const regularStartTime = new Date();
  regularStartTime.setHours(9, 0, 0, 0); // 9:00 AM
  const regularEndTime = new Date();
  regularEndTime.setHours(18, 0, 0, 0); // 6:00 PM

  const regularStartTimeInUserTimeZone = regularStartTime.toLocaleTimeString(
    undefined,
    {
      timeZone: userTimeZone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }
  );
  const regularEndTimeInUserTimeZone = regularEndTime.toLocaleTimeString(
    undefined,
    {
      timeZone: userTimeZone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }
  );

  const providedTimeInUserTimeZone = date.toLocaleTimeString(undefined, {
    timeZone: userTimeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  // Initialize flags for early and late conditions
  let earlyCondition = false;
  let lateCondition = false;

  if (status === "checkIn") {
    if (providedTimeInUserTimeZone < regularStartTimeInUserTimeZone) {
      earlyCondition = true;
    } else if (providedTimeInUserTimeZone > regularStartTimeInUserTimeZone) {
      lateCondition = true;
    }
  } else if (status === "checkOut") {
    if (providedTimeInUserTimeZone < regularEndTimeInUserTimeZone) {
      earlyCondition = true;
    } else if (providedTimeInUserTimeZone > regularEndTimeInUserTimeZone) {
      lateCondition = true;
    }
  }

  return { earlyCondition: earlyCondition, lateCondition: lateCondition };
};

// check if current day or past day of selected week
export const checkWeekDays = (startingDay, index) => {
  const date = dayjs(startingDay).add(index, "day");
  const isCurrentDay = date.isSame(new Date(), "day");
  const isPastDay = date.isBefore(new Date(), "day");

  return { isCurrentDay, isPastDay };
};

// get ordinal suffix
export const getOrdinalSuffix = (inputData) => {
  if (inputData >= 11 && inputData <= 13) {
    return "th";
  }
  switch (inputData % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

//Upload imported zip of users' list
export const uploadUserZip = async (fileInput) => {
  console.log("inputfile", fileInput);
  // file input must be a File object
  let authSession = JSON.parse(localStorage.getItem("authSession"));
  let { state } = authSession;

  try {
    if (!fileInput) {
      return null;
    } else {
      const formData = new FormData();
      formData.append("file", fileInput);
      const response = await fetch(ZIP_UPLOAD_URL, {
        method: "POST",
        headers: {
          authorization: `Bearer ${state.token}`,
        },
        body: formData,
      });

      const userList = await response.json();

      console.log("File uploaded successfully.");
      return userList.users;
    }
  } catch (error) {
    console.error("Error uploading zip file:", error);
    return null;
  }
};

// render error messages
export const renderErrorMsg = (errorMsg) => {
  return errorMsg && <span className={commonStyles.errorText}>{errorMsg}</span>;
};

//get No: of assigned users in certificate
export const getUniqueAssignedUsers = (certificateProfiles) => {
  const allAssignedData = [].concat(
    ...certificateProfiles?.map((certi) => certi.profiles)
  );
  const initialValue = [];
  const uniqueAssignedUsers = allAssignedData?.reduce(
    (accumulator, currentItem) => {
      if (
        accumulator.filter((item) => item.id === currentItem.id).length === 0
      ) {
        accumulator.push(currentItem);
      }
      return accumulator;
    },
    initialValue
  );
  return uniqueAssignedUsers;
};
