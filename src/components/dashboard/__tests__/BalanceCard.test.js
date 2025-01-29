import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import BalanceCard from "../BalanceCard";
import { walletService } from "../../utils/walletService.js";
import { isAuthenticated } from "../../utils/authService.js";

jest.mock("../../utils/walletService.js", () => ({
  walletService: {
    getBalance: jest.fn(),
    transferMoney: jest.fn(),
    rechargeWallet: jest.fn(),
  },
}));

jest.mock("../../utils/authService.js", () => ({
  isAuthenticated: jest.fn(),
}));

describe("BalanceCard Component", () => {
  const mockOnCompleteFetch = jest.fn();

  const renderComponent = () =>
    render(<BalanceCard onCompleteFetch={mockOnCompleteFetch} />);
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders BalanceCard component and fetches balance successfully", async () => {
    isAuthenticated.mockReturnValue(true);
    walletService.getBalance.mockResolvedValueOnce(100);

    render(<BalanceCard onCompleteFetch={mockOnCompleteFetch} />);

    expect(screen.getByText(/balance/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/balance/i)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(mockOnCompleteFetch).toHaveBeenCalled();
    });
  });

  test("handles fetch balance error correctly", async () => {
    isAuthenticated.mockReturnValue(true);
    const errorMessage = "Failed to fetch balance";
    walletService.getBalance.mockRejectedValueOnce(new Error(errorMessage));

    render(<BalanceCard onCompleteFetch={mockOnCompleteFetch} />);

    const errorElement = await screen.findByText(/Failed to fetch balance/i);

    expect(errorElement).toBeInTheDocument();
  });

  test("does not fetch balance if not authenticated", async () => {
    isAuthenticated.mockReturnValue(false);

    render(<BalanceCard onCompleteFetch={mockOnCompleteFetch} />);

    await waitFor(() => {
      expect(walletService.getBalance).not.toHaveBeenCalled();
    });
  });

  test("handles transfer successfully", async () => {
    isAuthenticated.mockReturnValue(true);
    walletService.getBalance
      .mockResolvedValueOnce(100)
      .mockResolvedValueOnce(150);
    walletService.transferMoney.mockResolvedValueOnce({});

    renderComponent();

    fireEvent.click(screen.getByText("Transfer"));
    expect(screen.getByText("Transfer Money")).toBeInTheDocument();

    const amountInput = screen.getByPlaceholderText("Enter amount");
    const recipientInput = screen.getByPlaceholderText("Enter recipient ID");
    fireEvent.change(amountInput, { target: { value: "50" } });
    fireEvent.change(recipientInput, { target: { value: "12345" } });

    expect(amountInput.value).toBe("50");
    expect(recipientInput.value).toBe("12345");

    fireEvent.click(screen.getByText("Transfer"));

    await waitFor(() => {
      expect(screen.queryByTestId("error-toast")).not.toBeInTheDocument();
    });
  });
});
