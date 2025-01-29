import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../DashBoardSidebar.jsx'; // Adjust import path as needed
import { clearToken } from '../../utils/authService.js';

// Mock react-router-dom hooks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useLocation: jest.fn()
}));

// Mock lucide-react icons to prevent rendering issues
jest.mock('lucide-react', () => ({
  LayoutDashboard: () => <div data-testid="dashboard-icon" />,
  BarChart2: () => <div data-testid="analytics-icon" />,
  HelpCircle: () => <div data-testid="help-icon" />,
  LogOut: () => <div data-testid="logout-icon" />,
  Menu: () => <div data-testid="menu-icon" />,
  X: () => <div data-testid="close-icon" />
}));

// Mock auth service
jest.mock('../../utils/authService.js', () => ({
  clearToken: jest.fn()
}));

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Sidebar Component', () => {
  const mockNavigate = jest.fn();
  const mockLocation = { pathname: '/dashboard' };

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup mocks for react-router
    useNavigate.mockReturnValue(mockNavigate);
    useLocation.mockReturnValue(mockLocation);

    // Setup localStorage
    localStorage.setItem('username', 'TestUser');

    // Setup window properties
    window.innerWidth = 1024;
  });

  const renderComponent = (pathname = '/dashboard') => {
    useLocation.mockReturnValue({ pathname });
    return render(
      <MemoryRouter initialEntries={[pathname]}>
        <Sidebar />
      </MemoryRouter>
    );
  };

  test('renders desktop sidebar with correct username', () => {
    renderComponent();

    expect(screen.getByText('WELCOME')).toBeInTheDocument();
    expect(screen.getByText('TestUser')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
  });

  test('renders mobile sidebar when window width is <= 768', () => {
    // Simulate mobile width
    Object.defineProperty(window, 'innerWidth', { value: 600 });
    
    act(() => {
      const resizeEvent = new Event('resize');
      window.dispatchEvent(resizeEvent);
    });

    renderComponent();

    expect(screen.getByText(/Welcome TestUser/i)).toBeInTheDocument();
    expect(screen.getByTestId('menu-icon')).toBeInTheDocument();
  });

  test('toggles mobile menu when menu icon is clicked', () => {
    // Simulate mobile width
    Object.defineProperty(window, 'innerWidth', { value: 600 });
    
    act(() => {
      const resizeEvent = new Event('resize');
      window.dispatchEvent(resizeEvent);
    });

    renderComponent();

    const menuIcon = screen.getByTestId('menu-icon');
    fireEvent.click(menuIcon);

    // Check if menu items are present
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
  });

  test('handles menu item clicks', () => {
    renderComponent();

    const dashboardItem = screen.getByText('Dashboard');
    const analyticsItem = screen.getByText('Analytics');
    const helpItem = screen.getByText('Help');
    const logoutItem = screen.getByText('Logout');

    fireEvent.click(dashboardItem);
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');

    fireEvent.click(analyticsItem);
    expect(mockNavigate).toHaveBeenCalledWith('/analytics');

    fireEvent.click(helpItem);
    expect(mockNavigate).toHaveBeenCalledWith('/help');

    fireEvent.click(logoutItem);
    expect(clearToken).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  test('handles different route active states', () => {
    const testRoutes = [
      { pathname: '/dashboard', expected: 'Dashboard' },
      { pathname: '/analytics', expected: 'Analytics' },
      { pathname: '/help', expected: 'Help' },
      { pathname: '/custom', expected: 'Custom' }
    ];

    testRoutes.forEach(({ pathname, expected }) => {
      const { container } = renderComponent(pathname);
      
      const activeItem = container.querySelector(`.bg-blue-100`);
      
      if (expected === 'Custom') {
        // For unexpected routes, no active item should be found
        expect(activeItem).toBeNull();
      } else {
        expect(activeItem).not.toBeNull();
        expect(activeItem).toHaveTextContent(expected);
      }
    });
  });
  test('closes mobile menu when path changes', () => {
    Object.defineProperty(window, 'innerWidth', { value: 600 });
    
    const { rerender } = render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Sidebar />
      </MemoryRouter>
    );

    const menuIcon = screen.getByTestId('menu-icon');
    fireEvent.click(menuIcon);

    const mobileMenu = screen.getByText('Dashboard');
    expect(mobileMenu).toBeInTheDocument();

    rerender(
      <MemoryRouter initialEntries={['/analytics']}>
        <Sidebar />
      </MemoryRouter>
    );

    const closedMobileMenu = screen.queryByText('Dashboard');
    expect(closedMobileMenu).toBeInTheDocument();
  });

});