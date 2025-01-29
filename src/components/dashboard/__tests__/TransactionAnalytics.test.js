import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TransactionAnalytics from '../TransactionAnalytics.jsx';
import { ChartService } from '../../utils/chartService.js';

jest.mock('../../utils/chartService.js');

const mockData = [
    { type: 'TRANSFER', amount: 1000, timestamp: '2023-12-01T00:00:00Z' },
    { type: 'RECHARGE', amount: 500, timestamp: '2023-12-02T00:00:00Z' },
    { type: 'CASHBACK', amount: 200, timestamp: '2023-12-03T00:00:00Z' },
  ];
  
  describe('TransactionAnalytics', () => {
    beforeEach(() => {
      ChartService.mockResolvedValue(mockData);
    });
  
    test('renders loading state initially', () => {
      render(<TransactionAnalytics />);
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });
  
    test('renders error state', async () => {
      ChartService.mockRejectedValueOnce(new Error('Failed to load data'));
      render(<TransactionAnalytics />);
      await waitFor(() => expect(screen.getByText(/failed to load data/i)).toBeInTheDocument());
    });
  
    test('renders charts with data', async () => {
      render(<TransactionAnalytics />);
      await waitFor(() => expect(screen.getByText(/transaction analytics/i)).toBeInTheDocument());
      expect(screen.getByText(/transfer/i)).toBeInTheDocument();
      expect(screen.getByText(/recharge/i)).toBeInTheDocument();
      expect(screen.getByText(/cashback/i)).toBeInTheDocument();
    });
  
    test('renders correct data in charts', async () => {
      render(<TransactionAnalytics />);
      await waitFor(() => {
        expect(screen.getByText(/₹1,000/i)).toBeInTheDocument();
        expect(screen.getByText(/₹500/i)).toBeInTheDocument();
        expect(screen.getByText(/₹200/i)).toBeInTheDocument();
      });
    });
  
    test('handles empty data', async () => {
      ChartService.mockResolvedValueOnce([]);
      render(<TransactionAnalytics />);
      await waitFor(() => expect(screen.getByText(/transaction analytics/i)).toBeInTheDocument());
      expect(screen.getByText(/no data available/i)).toBeInTheDocument();
    });
  });
  