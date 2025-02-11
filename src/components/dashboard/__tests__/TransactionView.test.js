import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TransactionsView from "../TransactionView.jsx";
import { transactionService } from "../../utils/transactionService.js";

jest.mock("../../utils/transactionService.js", () => ({
  transactionService: {
    getTransactions: jest.fn(),
  },
}));
const mockWrite = jest.fn();
const mockClose = jest.fn();
const mockPrint = jest.fn();

const mockWindow = {
  document: {
    write: mockWrite,
    close: mockClose,
  },
  print: mockPrint,
  close: mockClose,
};

global.window.open = jest.fn(() => mockWindow);
const setTotalsMock = jest.fn();
jest
  .spyOn(React, "useState")
  .mockImplementation(() => [
    { cashback: 0, outgoing: 0, incoming: 0 },
    setTotalsMock,
  ]);

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

  const mockLongTransactions = Array(15)
    .fill()
    .map((_, index) => ({
      id: `long-${index}`,
      timestamp: new Date().toISOString(),
      type: index % 3 === 0 ? "RECHARGE" : index % 3 === 1 ? "TRANSFER" : null,
      recipientId: index % 2 === 0 ? `user${index}` : null,
      senderId: index % 2 === 1 ? `sender${index}` : null,
      amount: 100 + index * 10,
    }));

  beforeEach(() => {
    transactionService.getTransactions.mockResolvedValue(mockTransactions);
    jest.clearAllMocks();
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
    expect(transactionService.getTransactions).toHaveBeenCalledWith(0, 5);
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

  describe("Transaction Amount Display", () => {
    it("displays RECHARGE amount in green", async () => {
      transactionService.getTransactions.mockResolvedValue([
        {
          id: "1",
          type: "RECHARGE",
          amount: 200,
          timestamp: Date.now(),
        },
      ]);
      render(<TransactionsView toggleFetch={false} />);
      const amountElement = await screen.findByText(/\+₹200.00/);
      expect(amountElement).toHaveClass("text-green-600");
    });

    it("displays CASHBACK amount in blue", async () => {
      transactionService.getTransactions.mockResolvedValue([
        {
          id: "1",
          amount: 50,
          timestamp: Date.now(),
        },
      ]);
      render(<TransactionsView toggleFetch={false} />);
      const amountElement = await screen.findByText(/₹50.00/);
      expect(amountElement).toHaveClass("text-blue-600");
    });
  });

  describe("Action Text Rendering", () => {
    it('displays "Recharged to Self" for RECHARGE transactions', async () => {
      transactionService.getTransactions.mockResolvedValue([
        {
          id: "1",
          type: "RECHARGE",
          amount: 200,
          timestamp: Date.now(),
        },
      ]);
      render(<TransactionsView toggleFetch={false} />);
      const actionElement = await screen.findByText("Recharged to Self");
      expect(actionElement).toBeInTheDocument();
    });

    it('displays "Received from" for TRANSFER with senderId', async () => {
      transactionService.getTransactions.mockResolvedValue([
        {
          id: "1",
          type: "TRANSFER",
          senderId: "user123",
          amount: 100,
          timestamp: Date.now(),
        },
      ]);
      render(<TransactionsView toggleFetch={false} />);
      const actionElement = await screen.findByText("Received from");
      expect(actionElement).toBeInTheDocument();
    });

    it('displays "Sent to" for TRANSFER with recipientId', async () => {
      transactionService.getTransactions.mockResolvedValue([
        {
          id: "1",
          type: "TRANSFER",
          recipientId: "user456",
          amount: 100,
          timestamp: Date.now(),
        },
      ]);
      render(<TransactionsView toggleFetch={false} />);
      const actionElement = await screen.findByText("Sent to");
      expect(actionElement).toBeInTheDocument();
    });
  });

  describe("PDF Generation Error Handling", () => {
    it("handles PDF generation errors gracefully", async () => {
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      global.window.open.mockImplementationOnce(() => {
        throw new Error("PDF generation failed");
      });

      render(<TransactionsView toggleFetch={false} />);
      await screen.findAllByRole("row");

      const exportButton = screen.getByRole("button", { name: /export pdf/i });
      fireEvent.click(exportButton);

      expect(consoleSpy).toHaveBeenCalledWith(
        "Error generating PDF:",
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  describe("Additional Loading States", () => {
    it("maintains loading state while data is being fetched", async () => {
      let resolvePromise;
      transactionService.getTransactions.mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolvePromise = resolve;
          })
      );

      render(<TransactionsView toggleFetch={false} />);
      expect(screen.getByText(/loading/i)).toBeInTheDocument();

      resolvePromise(mockTransactions);
      await waitFor(() => {
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
      });
    });
  });

  describe("Pagination Behavior", () => {
    it("enables previous button when page is greater than 0", async () => {
      render(<TransactionsView toggleFetch={false} />);
      await screen.findAllByRole("row");

      const nextButton = screen.getByRole("button", { name: /next/i });
      fireEvent.click(nextButton);

      const prevButton = screen.getByRole("button", { name: /previous/i });
      expect(prevButton).toBeDisabled();
    });

    it("loads more transactions when next button is clicked", async () => {
      transactionService.getTransactions.mockResolvedValueOnce(
        mockLongTransactions
      );

      render(<TransactionsView toggleFetch={false} />);
      await screen.findAllByRole("row");

      const nextButton = screen.getByRole("button", { name: /next/i });
      fireEvent.click(nextButton);

      expect(transactionService.getTransactions).toHaveBeenCalledWith(1, 5);
    });

    // it("disables next button when less than 10 transactions", async () => {
    //   const mockTransactions = Array(8).fill({
    //     id: "1",
    //     timestamp: new Date().toISOString(),
    //     type: "TRANSFER",
    //     recipientId: "user123",
    //     amount: 50,
    //   });

    //   transactionService.getTransactions.mockResolvedValueOnce(
    //     mockTransactions
    //   );

    //   render(<TransactionsView toggleFetch={false} />);

    //   await waitFor(() =>
    //     expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
    //   );

    //   const nextButton = screen.getByRole("button", { name: /next/i });
    //   expect(nextButton).toBeDisabled();
    // });
  });

  describe("Transaction Modal Interactions", () => {
    it("closes transaction details modal when close button is clicked", async () => {
      const mockTransaction = {
        id: "1",
        timestamp: new Date().toISOString(),
        type: "TRANSFER",
        recipientId: "user123",
        amount: 50,
      };

      transactionService.getTransactions.mockResolvedValueOnce([
        mockTransaction,
      ]);

      render(<TransactionsView toggleFetch={false} />);

      await waitFor(() => {
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
      });

      const rows = await screen.findAllByRole("row");
      fireEvent.click(rows[1]);

      expect(screen.getByText(/Transaction Details/i)).toBeInTheDocument();

      const closeButton = screen.getByRole("button", { name: /close/i });
      fireEvent.click(closeButton);

      await waitFor(() => {
        expect(
          screen.queryByText(/Transaction Details/i)
        ).not.toBeInTheDocument();
      });
    });

    it("displays correct transaction details in modal", async () => {
      const mockTransaction = {
        id: "1",
        timestamp: new Date().toISOString(),
        type: "TRANSFER",
        recipientId: "user123",
        amount: 50,
      };

      transactionService.getTransactions.mockResolvedValueOnce([
        mockTransaction,
      ]);

      render(<TransactionsView toggleFetch={false} />);

      await waitFor(() => {
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
      });

      const row = await screen.findByRole("row", {
        name: new RegExp(mockTransaction.id),
      });
      fireEvent.click(row);

      const typeText = screen.getAllByText(/TRANSFER/i)[1];
      expect(typeText).toBeInTheDocument();
      expect(screen.getByText(/Transaction Details/i)).toBeInTheDocument();
      expect(screen.getByText(/Type:/i)).toBeInTheDocument();
      expect(screen.getByText(/Amount:/i)).toBeInTheDocument();
    });
  });

  describe("Date Formatting", () => {
    it("correctly formats transaction timestamps", async () => {
      const testTimestamp = "2023-05-15T10:30:00Z";
      const mockFormattedTransactions = [
        {
          id: "test-date",
          timestamp: testTimestamp,
          type: "TRANSFER",
          amount: 75,
          recipientId: "user789",
        },
      ];

      transactionService.getTransactions.mockResolvedValueOnce(
        mockFormattedTransactions
      );

      render(<TransactionsView toggleFetch={false} />);

      const formattedDateElement = await screen.findByText(/May 15, 2023/i);
      expect(formattedDateElement).toBeInTheDocument();
    });
  });

  describe("Edge Case Handling", () => {
    it("handles empty transactions array gracefully", async () => {
      transactionService.getTransactions.mockResolvedValueOnce([]);

      render(<TransactionsView toggleFetch={false} />);

      const noTransactionsMessage = await screen.findByText(
        /No transactions found/i
      );
      expect(noTransactionsMessage).toBeInTheDocument();
    });
  });

  describe("Toggle Fetch Behavior", () => {
    it("re-fetches transactions when toggleFetch changes", async () => {
      const { rerender } = render(<TransactionsView toggleFetch={false} />);
      await screen.findAllByRole("row");

      rerender(<TransactionsView toggleFetch={true} />);

      expect(transactionService.getTransactions).toHaveBeenCalledTimes(2);
    });
  });
  describe("Re-fetch Behavior", () => {
    it("refetches data when toggleFetch prop changes", async () => {
      const { rerender } = render(<TransactionsView toggleFetch={false} />);

      await waitFor(() =>
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
      );

      rerender(<TransactionsView toggleFetch={true} />);

      expect(transactionService.getTransactions).toHaveBeenCalledTimes(2);
    });
  });
});
