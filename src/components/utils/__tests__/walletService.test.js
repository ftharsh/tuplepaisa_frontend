import { walletService } from '../walletService';
import { getToken } from '../authService';

jest.mock('../authService', () => ({
  getToken: jest.fn(),
}));

global.fetch = jest.fn();

describe('walletService', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  describe('getBalance', () => {
    test('fetches balance successfully', async () => {
      const mockData = { balance: 100 };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });
      getToken.mockReturnValue('mock-token');

      const result = await walletService.getBalance();

      expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/wallet/balance', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer mock-token',
          'Content-Type': 'application/json',
        },
      });

      expect(result).toEqual(mockData.balance);
    });

    test('throws an error when response is not ok', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({}),
        message: async () => 'Not Found',
      });
      getToken.mockReturnValue('mock-token');

      await expect(walletService.getBalance()).rejects.toThrow('Not Found');
    });

    test('handles fetch errors correctly', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));
      getToken.mockReturnValue('mock-token');

      await expect(walletService.getBalance()).rejects.toThrow('Network error');
    });

    test('handles unexpected errors correctly', async () => {
      fetch.mockRejectedValueOnce({});
      getToken.mockReturnValue('mock-token');

      await expect(walletService.getBalance()).rejects.toThrow('Unknown error occurred');
    });
  });

  describe('rechargeWallet', () => {
    test('recharges wallet successfully', async () => {
      const mockData = { success: true };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });
      getToken.mockReturnValue('mock-token');

      const result = await walletService.rechargeWallet(100);

      expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/wallet/recharge?amount=100', {
        method: 'POST',
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
        json: async () => ({ message: 'Not Found' }),
      });
      getToken.mockReturnValue('mock-token');

      await expect(walletService.rechargeWallet(100)).rejects.toThrow('Not Found');
    });

    test('handles fetch errors correctly', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));
      getToken.mockReturnValue('mock-token');

      await expect(walletService.rechargeWallet(100)).rejects.toThrow('Network error');
    });

    test('handles unexpected errors correctly', async () => {
      fetch.mockRejectedValueOnce({});
      getToken.mockReturnValue('mock-token');

      await expect(walletService.rechargeWallet(100)).rejects.toThrow('Unknown error occurred');
    });
  });

  describe('transferMoney', () => {
    test('transfers money successfully', async () => {
      const mockData = { success: true };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });
      getToken.mockReturnValue('mock-token');

      const result = await walletService.transferMoney('recipientId', 100);

      expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/wallet/transfer?recipientId=recipientId&amount=100', {
        method: 'POST',
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
        json: async () => ({ message: 'Transfer failed' }),
      });
      getToken.mockReturnValue('mock-token');

      await expect(walletService.transferMoney('recipientId', 100)).rejects.toThrow('Transfer failed');
    });

    test('handles fetch errors correctly', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));
      getToken.mockReturnValue('mock-token');

      await expect(walletService.transferMoney('recipientId', 100)).rejects.toThrow('Network error');
    });

    test('handles unexpected errors correctly', async () => {
      fetch.mockRejectedValueOnce({});
      getToken.mockReturnValue('mock-token');

      await expect(walletService.transferMoney('recipientId', 100)).rejects.toThrow('Unknown error occurred');
    });
  });
});
