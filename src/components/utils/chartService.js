import { getToken } from "./authService.js";

const formatDateStrictly = (date) => {
  return date.toISOString().replace(/\.\d{3}Z$/, "");
};

export const ChartService = async (startDate = null, endDate = null) => {
  try {
    const defaultStartDate = new Date();
    defaultStartDate.setMonth(defaultStartDate.getMonth() - 1);
    const defaultEndDate = new Date();

    const formattedStartDate = startDate
      ? formatDateStrictly(new Date(startDate))
      : formatDateStrictly(defaultStartDate);

    const formattedEndDate = endDate
      ? formatDateStrictly(new Date(endDate))
      : formatDateStrictly(defaultEndDate);

    const requestBody = {
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    };

    const response = await fetch(
      "http://localhost:8080/api/charts/chartsHistory",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const combinedData = await response.json();
    return combinedData;
  } catch (error) {
    const errorMessage = error?.message || "Unknown error occurred";
    console.error("Error fetching chart data:", errorMessage);
    throw new Error(errorMessage);
  }
};
