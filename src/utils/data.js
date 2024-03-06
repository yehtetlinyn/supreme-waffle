import dayjs from "dayjs";

export const priorityOptions = [
  { value: "Low", label: "Low" },
  { value: "Medium", label: "Medium" },
  { value: "High", label: "High" },
  { value: "Urgent", label: "Urgent" },
];

export const statusOptions = [
  { value: "Pending", label: "Pending" },
  { value: "In Progress", label: "In Progress" },
  { value: "Completed", label: "Completed" },
];

export const timeRanges = [
  { startTime: "08:00:00.000", endTime: "18:00:00.000" },
  { startTime: "14:00:00.000", endTime: "19:00:00.000" },
  { startTime: "18:00:00.000", endTime: "23:00:00.000" },
];

export const shiftScheduleOptions = [
  {
    optionId: 0,
    value: "08:00 - 18:00",
    label: "Morning Shift",
    startTime: "08:00:00.000",
    endTime: "18:00:00.000",
  },
  {
    optionId: 1,
    value: "14:00 - 19:00",
    label: "Evening Shift",
    startTime: "14:00:00.000",
    endTime: "19:00:00.000",
  },
  {
    optionId: 2,
    value: "18:00 - 23:00",
    label: "Night Shift",
    startTime: "18:00:00.000",
    endTime: "23:00:00.000",
  },
];

export const daysInShort = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// get initial starting day
export const getInitialStartingDay = () => {
  const currentDay = dayjs().day(); // Get current day index (0-6)
  const daysToShift = currentDay === 0 ? 6 : currentDay - 1; // Calculate days to shift
  return dayjs().subtract(daysToShift, "day"); // Calculate starting day (always Monday)
};

export const timeOptions = [
  { value: "00:00", label: "12:00 AM" },
  { value: "01:00", label: "01:00 AM" },
  { value: "02:00", label: "02:00 AM" },
  { value: "03:00", label: "03:00 AM" },
  { value: "04:00", label: "04:00 AM" },
  { value: "05:00", label: "05:00 AM" },
  { value: "06:00", label: "06:00 AM" },
  { value: "07:00", label: "07:00 AM" },
  { value: "08:00", label: "08:00 AM" },
  { value: "09:00", label: "09:00 AM" },
  { value: "10:00", label: "10:00 AM" },
  { value: "11:00", label: "11:00 AM" },
  { value: "12:00", label: "12:00 PM" },
  { value: "13:00", label: "01:00 PM" },
  { value: "14:00", label: "02:00 PM" },
  { value: "15:00", label: "03:00 PM" },
  { value: "16:00", label: "04:00 PM" },
  { value: "17:00", label: "05:00 PM" },
  { value: "18:00", label: "06:00 PM" },
  { value: "19:00", label: "07:00 PM" },
  { value: "20:00", label: "08:00 PM" },
  { value: "21:00", label: "09:00 PM" },
  { value: "22:00", label: "10:00 PM" },
  { value: "23:00", label: "11:00 PM" },
];

export const renderNotifyRosterMsg = () => {
  let notifyRosterMsg = (
    <>
      <div className="text-start">
        Please assign users into the selected shift roster.
      </div>
    </>
  );

  return notifyRosterMsg;
};
