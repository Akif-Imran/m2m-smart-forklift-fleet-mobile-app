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
