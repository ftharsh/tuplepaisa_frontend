import { getToken } from "./authService.js";

const API_BASE_URL = "http://localhost:8080";

const getHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
  "Content-Type": "application/json",
});

export const transactionService = {
  async getTransactions(page = 0, size = 5) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/wallet/statement?page=${page}&size=${size}`,
        {
          headers: getHeaders(),
        }
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse?.message || `Unknown error occurred`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      const errorMessage = error?.message || "Unknown error occurred";
      throw new Error(errorMessage);
    }
  },
};
