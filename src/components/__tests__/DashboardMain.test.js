import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DashboardLayout from '../../components/DashboardMain';
import Sidebar from '../dashboard/DashBoardSidebar';
import ReportCard from '../dashboard/ReportCard';
import BalanceCard from '../dashboard/BalanceCard';
import TransactionsView from '../dashboard/TransactionView';

jest.mock('../dashboard/DashBoardSidebar');
jest.mock('../dashboard/ReportCard');
jest.mock('../dashboard/BalanceCard');
jest.mock('../dashboard/TransactionView');

describe('DashboardLayout Component', () => {
  beforeAll(() => {
    Sidebar.mockImplementation(() => <div>Sidebar Component</div>);
    ReportCard.mockImplementation(() => <div>ReportCard Component</div>);
    BalanceCard.mockImplementation(({ onCompleteFetch }) => (
      <div>
        BalanceCard Component
        <button onClick={onCompleteFetch}>Complete Fetch</button>
      </div>
    ));
    TransactionsView.mockImplementation(({ toggleFetch }) => (
      <div>TransactionsView Component - Fetch: {toggleFetch.toString()}</div>
    ));
  });

  const renderComponent = () => render(<DashboardLayout />);

  test('renders DashboardLayout component', () => {
    renderComponent();
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Overview of your financial insights/i)).toBeInTheDocument();
    expect(screen.getByText('Sidebar Component')).toBeInTheDocument();
    expect(screen.getByText('ReportCard Component')).toBeInTheDocument();
    expect(screen.getByText('BalanceCard Component')).toBeInTheDocument();
    expect(screen.getByText('TransactionsView Component - Fetch: false')).toBeInTheDocument();
  });

  test('toggles fetch state when button is clicked', () => {
    renderComponent();
    const button = screen.getByText('Complete Fetch');
    expect(screen.getByText('TransactionsView Component - Fetch: false')).toBeInTheDocument();
    fireEvent.click(button);
    expect(screen.getByText('TransactionsView Component - Fetch: true')).toBeInTheDocument();
  });
});
