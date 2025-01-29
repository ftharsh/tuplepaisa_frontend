import { getToken } from "./authService.js";

export const ChartService = async () => {
  try {
    const response = await fetch(
      "http://localhost:8080/api/wallet/chartsHistory",
      {
        headers: {
          Authorization: `Bearer ${getToken()}`, // *Fetch token from local storage
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const combinedData = await response.json();
    return combinedData;
  } catch (error) {
    const errorMessage = error?.message || "Unknown error occurred";
    console.error("Error fetching chart data:", error.message);
    throw new Error(errorMessage); //* Re-throw the error to be handled by the caller
  }
};
