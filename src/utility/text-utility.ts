export const truncateText = (text: string, limit: number = 22) => {
  if (text.length <= limit) {
    return text;
  } else {
    return text.substring(0, limit) + "...";
  }
};
