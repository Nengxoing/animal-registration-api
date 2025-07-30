import dayjs from "dayjs";

// Define a constant for the magic number
const hoursToAdd = 7;

export function dateFormatService(date: string) {
  return dayjs(date).format("YYYY-MM-DD");
}

export function dateFormatter(date: Date | any): string {
  const formatted = dayjs(date).format("YYYY-MM-DD");
  if (formatted.includes("Invalid")) {
    return "";
  }
  return formatted;
}

export const dateDir = dayjs().format("YYYYMMDD");

export function dateTimeFormat(date: Date | string | any, format: string = "YYYY-MM-DD HH:mm:ss"): string {
  const result = dayjs(date).format(format);
  if (result.includes("Invalid")) {
    return "";
  }
  return result;
}

export const createdTime = (date?: Date) => {
  if (!date) {
    return dayjs(dayjs().add(hoursToAdd, "hours").format()).toDate();
  }
  return dayjs(dayjs(date).add(hoursToAdd, "hours").format()).toDate();
};

export const convertDateTime = (date: Date): string => {
  return dayjs(date).subtract(hoursToAdd, "hours").format("HH:mm:ss");
};

export function formateDateToClient(date: Date | null) {
  return dayjs(date).format("DD/MM/YYYY");
}