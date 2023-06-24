export const truncateText = (text: string, limit = 22) => {
  if (text.length <= limit) {
    return text;
  } else {
    return text.substring(0, limit) + "...";
  }
};
