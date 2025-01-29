import { ChartService } from '../chartService.js';
import { getToken } from '../authService.js';

jest.mock('../authService.js', () => ({
  getToken: jest.fn(),
}));

global.fetch = jest.fn();

describe('ChartService', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('fetches chart data successfully', async () => {
    const mockData = { data: 'sample data' };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });
    getToken.mockReturnValue('mock-token');

    const result = await ChartService();

    expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/wallet/chartsHistory', {
      headers: {
        Authorization: 'Bearer mock-token',
        'Content-Type': 'application/json',
      },
    });

    expect(result).toEqual(mockData);
  });

  test('throws an error when response is not ok', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    });
    getToken.mockReturnValue('mock-token');

    await expect(ChartService()).rejects.toThrow('HTTP error! Status: 404');
  });

  test('handles fetch errors correctly', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));
    getToken.mockReturnValue('mock-token');

    await expect(ChartService()).rejects.toThrow('Network error');
  });
});
