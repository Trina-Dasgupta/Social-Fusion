import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ; 

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


api.interceptors.response.use(
  (response) => response,
  (error) => {
    let errorMessage = "An unexpected error occurred";

    if (error.response) {
      errorMessage = error.response.data?.error || error.response.data?.message || JSON.stringify(error.response.data);
    } else if (error.request) {
      errorMessage = "No response from server. Please check your internet connection.";
    } else {
      errorMessage = error.message;
    }


    return Promise.reject({ error: errorMessage });
  }
);
