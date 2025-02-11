import { transactionService } from "../transactionService";
import { getToken } from "../authService";

jest.mock("../authService", () => ({
  getToken: jest.fn(),
}));

global.fetch = jest.fn();

describe("transactionService", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test("fetches transactions successfully", async () => {
    const mockData = { transactions: [] };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });
    getToken.mockReturnValue("mock-token");

    const result = await transactionService.getTransactions(1, 5);

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8080/api/wallet/statement?page=1&size=5",
      {
        headers: {
          Authorization: "Bearer mock-token",
          "Content-Type": "application/json",
        },
      }
    );

    expect(result).toEqual(mockData);
  });

  test("fetches transactions successfully with custom parameters", async () => {
    const mockData = { transactions: [] };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const result = await transactionService.getTransactions(1, 5);

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8080/api/wallet/statement?page=1&size=5",
      {
        headers: {
          Authorization: "Bearer mock-token",
          "Content-Type": "application/json",
        },
      }
    );
    expect(result).toEqual(mockData);
  });

  test("uses default parameters when none provided", async () => {
    const mockData = { transactions: [] };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    await transactionService.getTransactions();

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8080/api/wallet/statement?page=0&size=5",
      expect.any(Object)
    );
  });

  test("handles API error with specific error message", async () => {
    const errorResponse = { message: "Not Found" };
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => errorResponse,
    });

    await expect(transactionService.getTransactions()).rejects.toThrow(
      "Not Found"
    );
  });

  test("handles API error with null response", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => null,
    });

    await expect(transactionService.getTransactions()).rejects.toThrow(
      "Unknown error occurred"
    );
  });

  test("handles network error", async () => {
    fetch.mockRejectedValueOnce(new Error("Network error"));

    await expect(transactionService.getTransactions()).rejects.toThrow(
      "Network error"
    );
  });

  test("handles json parsing error", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => {
        throw new Error("JSON parse error");
      },
    });

    await expect(transactionService.getTransactions()).rejects.toThrow(
      "JSON parse error"
    );
  });

  test("handles missing auth token", async () => {
    getToken.mockReturnValue(null);
    const mockData = { transactions: [] };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    await transactionService.getTransactions();

    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: {
          Authorization: "Bearer null",
          "Content-Type": "application/json",
        },
      })
    );
  });

  test("handles undefined error without message property", async () => {
    fetch.mockRejectedValueOnce(undefined);

    await expect(transactionService.getTransactions()).rejects.toThrow(
      "Unknown error occurred"
    );
  });

  test("handles error response with empty object", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    });

    await expect(transactionService.getTransactions()).rejects.toThrow(
      "Unknown error occurred"
    );
  });

  test("throws an error when response is not ok and includes error message from response", async () => {
    const errorResponse = { message: "Not Found" };
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => errorResponse,
    });
    getToken.mockReturnValue("mock-token");

    await expect(transactionService.getTransactions(1, 5)).rejects.toThrow(
      "Not Found"
    );
  });

  test("throws an error when response is not ok and includes default error message", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    });
    getToken.mockReturnValue("mock-token");

    await expect(transactionService.getTransactions(1, 5)).rejects.toThrow(
      "Unknown error occurred"
    );
  });

  test("handles fetch errors correctly", async () => {
    fetch.mockRejectedValueOnce(new Error("Network error"));
    getToken.mockReturnValue("mock-token");

    await expect(transactionService.getTransactions(1, 5)).rejects.toThrow(
      "Network error"
    );
  });

  test("handles unexpected errors correctly", async () => {
    fetch.mockRejectedValueOnce({});
    getToken.mockReturnValue("mock-token");

    await expect(transactionService.getTransactions(1, 5)).rejects.toThrow(
      "Unknown error occurred"
    );
  });
});
