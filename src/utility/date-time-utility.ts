import moment from "moment";

export const FORMAT_DURATION_HH_MM_SS = (durationInSeconds: number): string => {
  const hours = moment
    .duration(durationInSeconds, "s")
    .hours()
    .toString()
    .padStart(2, "0");
  const minutes = moment
    .duration(durationInSeconds, "s")
    .minutes()
    .toString()
    .padStart(2, "0");
  const seconds = moment
    .duration(durationInSeconds, "s")
    .seconds()
    .toString()
    .padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
};

export const FORMAT_DATE_DD_MM_YYYY_HH_MM_12 = (date: Date): string => {
  return moment(date).format("DD MMM, YYYY hh:mm A");
};

export const FORMAT_DATE_STRING_DD_MM_YYYY_HH_MM_12 = (
  date: string
): string => {
  return moment(date).format("DD MMM, YYYY hh:mm A");
};

export const FORMAT_DATE_DD_MM_YYYY = (date: string): string => {
  return moment(date).format("DD MMM, YYYY");
};
