import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

// Mock components
const MockAuthPage = () => <div>AuthPage Component</div>;
const MockHomepage = () => <div>Homepage Component</div>;
const MockTransactionsView = () => <div>TransactionsView Component</div>;
const MockDashboard = () => <div>Dashboard Component</div>;
const MockAnalytics = () => <div>Analytics Component</div>;
const MockHelpPage = () => <div>HelpPage Component</div>;

const MockPreloader = ({ onComplete }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 100);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return <div>Preloader Component</div>;
};

jest.mock("./components/Authpage", () => ({
  __esModule: true,
  default: () => <MockAuthPage />,
}));

jest.mock("./components/home/Homepage", () => ({
  __esModule: true,
  default: () => <MockHomepage />,
}));

jest.mock("./components/dashboard/TransactionView", () => ({
  __esModule: true,
  default: () => <MockTransactionsView />,
}));

jest.mock("./components/DashboardMain", () => ({
  __esModule: true,
  default: () => <MockDashboard />,
}));

jest.mock("./components/dashboard/TransactionAnalytics", () => ({
  __esModule: true,
  default: () => <MockAnalytics />,
}));

jest.mock("./components/Preloader.jsx", () => ({
  __esModule: true,
  default: ({ onComplete }) => <MockPreloader onComplete={onComplete} />,
}));

jest.mock("./components/dashboard/WalletTutorial.jsx", () => ({
  __esModule: true,
  default: () => <MockHelpPage />,
}));

describe("App Component", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test("renders Preloader initially", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText("Preloader Component")).toBeInTheDocument();
  });

  test("renders Router and Routes after Preloader completes", async () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    jest.advanceTimersByTime(100);

    await waitFor(() => {
      expect(screen.queryByText("Preloader Component")).not.toBeInTheDocument();
    });

    expect(screen.getByText("Homepage Component")).toBeInTheDocument();
  });

  test("renders correct component for each route", async () => {
    render(
      <MemoryRouter initialEntries={["/Authpage"]}>
        <App />
      </MemoryRouter>
    );

    jest.advanceTimersByTime(100);

    await waitFor(() => {
      expect(screen.queryByText("Preloader Component")).not.toBeInTheDocument();
    });

    expect(screen.getByText("AuthPage Component")).toBeInTheDocument();
  });
});
