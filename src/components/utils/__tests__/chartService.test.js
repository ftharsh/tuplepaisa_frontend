import { ChartService } from "../chartService.js";
import { getToken } from "../authService.js";

jest.mock("../authService.js", () => ({
  getToken: jest.fn(),
}));

global.fetch = jest.fn();

const formatDateStrictly = (date) => {
  return date.toISOString().replace(/\.\d{3}Z$/, "");
};

describe("ChartService", () => {
  const mockToken = "mocked-token";

  beforeEach(() => {
    jest.clearAllMocks();
    getToken.mockReturnValue(mockToken);
  });

  it("should call fetch with correct request body and headers", async () => {
    const mockResponse = { data: "mocked data" };
    fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    const startDate = new Date("2024-01-01T00:00:00Z");
    const endDate = new Date("2024-02-01T00:00:00Z");

    const formattedStartDate = formatDateStrictly(startDate);
    const formattedEndDate = formatDateStrictly(endDate);

    const result = await ChartService(
      startDate.toISOString(),
      endDate.toISOString()
    );

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8080/api/charts/chartsHistory",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer mocked-token",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startDate: formattedStartDate,
          endDate: formattedEndDate,
        }),
      }
    );
    expect(result).toEqual(mockResponse);
  });

  it("should throw an error if fetch fails", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    await expect(ChartService()).rejects.toThrow("HTTP error! Status: 500");

    expect(fetch).toHaveBeenCalled();
  });

  it("should handle unknown errors gracefully", async () => {
    fetch.mockRejectedValueOnce(new Error("Network error"));

    await expect(ChartService()).rejects.toThrow("Network error");

    expect(fetch).toHaveBeenCalled();
  });
});
