import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TransactionsView from "../TransactionView.jsx";
import { transactionService } from "../../utils/transactionService.js";

jest.mock("../../utils/transactionService.js", () => ({
  transactionService: {
    getTransactions: jest.fn(),
  },
}));

describe("TransactionsView Component", () => {
  const mockTransactions = [
    {
      id: "1",
      timestamp: new Date().toISOString(),
      type: "RECHARGE",
      recipientId: null,
      amount: 100,
    },
    {
      id: "2",
      timestamp: new Date().toISOString(),
      type: "TRANSFER",
      recipientId: "user123",
      amount: 50,
    },
    {
      id: "3",
      timestamp: new Date().toISOString(),
      type: null,
      recipientId: null,
      amount: 20,
    },
  ];

  beforeEach(() => {
    transactionService.getTransactions.mockResolvedValue(mockTransactions);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the component with transactions", async () => {
    render(<TransactionsView toggleFetch={false} />);

    expect(screen.getByText(/loading.../i)).toBeInTheDocument();

    const rows = await screen.findAllByRole("row");
    expect(rows).toHaveLength(mockTransactions.length + 1);
  });

  it("displays an error message if fetching transactions fails", async () => {
    transactionService.getTransactions.mockRejectedValueOnce(
      new Error("Failed to fetch data")
    );

    render(<TransactionsView toggleFetch={false} />);

    const errorMessage = await screen.findByText(/failed to fetch data/i);
    expect(errorMessage).toBeInTheDocument();
  });

  it("handles pagination correctly", async () => {
    render(<TransactionsView toggleFetch={false} />);

    await screen.findAllByRole("row");

    const nextButton = screen.getByRole("button", { name: /next/i });
    expect(nextButton).toBeDisabled();

    fireEvent.click(nextButton);

    expect(transactionService.getTransactions).toHaveBeenCalledWith(0, 10);
  });

  it("shows transaction details in a modal on row click", async () => {
    render(<TransactionsView toggleFetch={false} />);

    const rows = await screen.findAllByRole("row");

    fireEvent.click(rows[1]);

    expect(screen.getByText(/transaction details/i)).toBeInTheDocument();
    expect(screen.getByText(/type:/i)).toBeInTheDocument();
    expect(screen.getByText(/transaction id:/i)).toBeInTheDocument();
  });

  it("exports transactions to a PDF when the export button is clicked", async () => {
    global.open = jest.fn(() => ({
      document: {
        write: jest.fn(),
        close: jest.fn(),
        print: jest.fn(),
      },
    }));

    render(<TransactionsView toggleFetch={false} />);

    await screen.findAllByRole("row");

    const exportButton = screen.getByRole("button", { name: /export pdf/i });
    fireEvent.click(exportButton);

    expect(global.open).toHaveBeenCalled();
    const mockWindow = global.open.mock.results[0].value;
    expect(mockWindow.document.write).toHaveBeenCalled();
  });
});
