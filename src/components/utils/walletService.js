import { getToken } from "./authService.js";

const API_BASE_URL = "http://localhost:8080"; // Change this to match your backend URL

const getHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
  "Content-Type": "application/json",
});

export const walletService = {
  async getBalance() {
    try {
      console.log("Fetching balance...");
      console.log("Token:", getToken());

      const response = await fetch(`${API_BASE_URL}/api/wallet/balance`, {
        method: "GET",
        headers: getHeaders(),
      });

      console.log("Balance Response:", response);

      if (!response.ok) {
        const errorText =
          (await response?.message()) || "Unknown error occured..";
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Balance data:", data);
      return data.balance;
    } catch (error) {
      const errorMessage = error?.message || "Unknown error occurred";
      console.error("Error fetching balance:", error.message);
      throw new Error(errorMessage);
    }
  },

  async rechargeWallet(amount) {
    try {
      console.log("Recharging wallet...", amount);
      const response = await fetch(
        `${API_BASE_URL}/api/wallet/recharge?amount=${amount}`,
        {
          method: "POST",
          headers: getHeaders(),
        }
      );

      console.log("Recharge Response:", response);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Recharge error data:", errorData.message);
        throw new Error(errorData?.message || "Unknown error occurred");
      }

      const data = await response.json();
      console.log("Recharge data:", data);
      return data;
    } catch (error) {
      const errorMessage = error?.message || "Unknown error occurred";
      console.error("Error recharging wallet:", error.message);
      throw new Error(errorMessage);
    }
  },

  async transferMoney(recipientId, amount) {
    try {
      console.log("Transferring money...", { recipientId, amount });
      const response = await fetch(
        `${API_BASE_URL}/api/wallet/transfer?recipientId=${recipientId}&amount=${amount}`,
        {
          method: "POST",
          headers: getHeaders(),
        }
      );

      console.log("Transfer Response:", response);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Transfer error data:", errorData);
        throw new Error(errorData?.message || "Transfer failed");
      }

      const data = await response.json();
      console.log("Transfer data:", data);
      return data;
    } catch (error) {
      const errorMessage = error?.message || "Unknown error occurred";
      console.error("Error transferring money:", error.message);
      throw new Error(errorMessage);
    }
  },
};
