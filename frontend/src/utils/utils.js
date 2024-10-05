// Function to format date based on provided timestamp
export function formatDate(date_ms) {
  // Convert milliseconds to Date object
  const date_obj = new Date(date_ms);
  const current_date = new Date();
  current_date.setHours(0, 0, 0, 0);

  // Check if it's today
  if (date_obj.toDateString() === current_date.toDateString()) {
    return date_obj.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  // Check if it's yesterday
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (date_obj.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }

  // Check if it's a different day of the week
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  if (date_obj.getTime() < current_date.getTime()) {
    return days[date_obj.getDay()];
  }

  // Return formatted date for older messages
  return `${date_obj.getFullYear()}/${
    date_obj.getMonth() + 1
  }/${date_obj.getDate()}`;
}

// Check if two timestamps are on the same day
export const isSameDay = (timestamp1, timestamp2) => {
  const date1 = new Date(timestamp1);
  const date2 = new Date(timestamp2);
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

// Get relative date/time for messages
export const getRelativeDateTime = (message, previousMessage) => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 7);

  const messageDate = new Date(message.createdAt);

  if (
    !previousMessage ||
    !isSameDay(previousMessage.createdAt, messageDate.getTime())
  ) {
    if (isSameDay(messageDate.getTime(), today.getTime())) {
      return "今天";
    } else if (isSameDay(messageDate.getTime(), yesterday.getTime())) {
      return "昨天";
    } else if (messageDate.getTime() > lastWeek.getTime()) {
      return messageDate.toLocaleDateString(undefined, { weekday: "long" });
    } else {
      return messageDate.toLocaleDateString(undefined, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    }
  }
};
