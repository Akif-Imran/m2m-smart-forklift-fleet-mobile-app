import axios from "axios";

export const baseURL = "";

export default axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});
