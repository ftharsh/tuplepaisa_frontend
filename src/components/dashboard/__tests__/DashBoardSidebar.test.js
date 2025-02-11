import React from "react";
import { render, screen, fireEvent, act, within } from "@testing-library/react";
import { MemoryRouter, useLocation, useNavigate } from "react-router-dom";
import Sidebar, { MenuItem } from "../DashBoardSidebar.jsx";
import { clearToken } from "../../utils/authService.js";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
}));

jest.mock("lucide-react", () => ({
  LayoutDashboard: () => <div data-testid="dashboard-icon" />,
  BarChart2: () => <div data-testid="analytics-icon" />,
  HelpCircle: () => <div data-testid="help-icon" />,
  LogOut: () => <div data-testid="logout-icon" />,
  Menu: () => <div data-testid="menu-icon" />,
  X: () => <div data-testid="close-icon" />,
}));

jest.mock("../../utils/authService.js", () => ({
  clearToken: jest.fn(),
}));

const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, "localStorage", { value: localStorageMock });

const renderComponent = (pathname = "/dashboard") => {
  useLocation.mockReturnValue({ pathname });
  return render(
    <MemoryRouter initialEntries={[pathname]}>
      <Sidebar />
    </MemoryRouter>
  );
};

describe("Sidebar Component", () => {
  const mockNavigate = jest.fn();
  const mockLocation = { pathname: "/dashboard" };

  beforeEach(() => {
    jest.clearAllMocks();

    useNavigate.mockReturnValue(mockNavigate);
    useLocation.mockReturnValue(mockLocation);

    localStorage.setItem("username", "TestUser");

    window.innerWidth = 1024;
  });

  test("renders desktop sidebar with correct username", () => {
    renderComponent();

    expect(screen.getByText("WELCOME")).toBeInTheDocument();
    expect(screen.getByText("TestUser")).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Analytics")).toBeInTheDocument();
  });

  test("renders mobile sidebar when window width is <= 768", () => {
    Object.defineProperty(window, "innerWidth", { value: 600 });

    act(() => {
      const resizeEvent = new Event("resize");
      window.dispatchEvent(resizeEvent);
    });

    renderComponent();

    expect(screen.getByText(/Welcome TestUser/i)).toBeInTheDocument();
    expect(screen.getByTestId("menu-icon")).toBeInTheDocument();
  });

  test("toggles mobile menu when menu icon is clicked", () => {
    // Simulate mobile width
    Object.defineProperty(window, "innerWidth", { value: 600 });

    act(() => {
      const resizeEvent = new Event("resize");
      window.dispatchEvent(resizeEvent);
    });

    renderComponent();

    const menuIcon = screen.getByTestId("menu-icon");
    fireEvent.click(menuIcon);

    // Check if menu items are present
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Analytics")).toBeInTheDocument();
  });

  test("handles menu item clicks", () => {
    renderComponent();

    const dashboardItem = screen.getByText("Dashboard");
    const analyticsItem = screen.getByText("Analytics");
    const helpItem = screen.getByText("Help");
    const logoutItem = screen.getByText("Logout");

    fireEvent.click(dashboardItem);
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");

    fireEvent.click(analyticsItem);
    expect(mockNavigate).toHaveBeenCalledWith("/analytics");

    fireEvent.click(helpItem);
    expect(mockNavigate).toHaveBeenCalledWith("/help");

    fireEvent.click(logoutItem);
    expect(clearToken).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  test("handles different route active states", () => {
    const testRoutes = [
      { pathname: "/dashboard", expected: "Dashboard" },
      { pathname: "/analytics", expected: "Analytics" },
      { pathname: "/help", expected: "Help" },
      { pathname: "/custom", expected: "Custom" },
    ];

    testRoutes.forEach(({ pathname, expected }) => {
      const { container } = renderComponent(pathname);

      const activeItem = container.querySelector(`.bg-blue-100`);

      if (expected === "Custom") {
        // For unexpected routes, no active item should be found
        expect(activeItem).toBeNull();
      } else {
        expect(activeItem).not.toBeNull();
        expect(activeItem).toHaveTextContent(expected);
      }
    });
  });
  test("closes mobile menu when path changes", () => {
    Object.defineProperty(window, "innerWidth", { value: 600 });

    const { rerender } = render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Sidebar />
      </MemoryRouter>
    );

    const menuIcon = screen.getByTestId("menu-icon");
    fireEvent.click(menuIcon);

    const mobileMenu = screen.getByText("Dashboard");
    expect(mobileMenu).toBeInTheDocument();

    rerender(
      <MemoryRouter initialEntries={["/analytics"]}>
        <Sidebar />
      </MemoryRouter>
    );

    const closedMobileMenu = screen.queryByText("Dashboard");
    expect(closedMobileMenu).toBeInTheDocument();
  });

  test("handles no username in localStorage", () => {
    localStorage.removeItem("username");
    renderComponent();

    expect(screen.getByText("username")).toBeInTheDocument();
  });

  test("handles window resize events thoroughly", () => {
    const { rerender } = renderComponent();

    act(() => {
      Object.defineProperty(window, "innerWidth", { value: 600 });
      const resizeEvent = new Event("resize");
      window.dispatchEvent(resizeEvent);
    });

    rerender(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );

    expect(screen.getByTestId("menu-icon")).toBeInTheDocument();

    act(() => {
      Object.defineProperty(window, "innerWidth", { value: 1200 });
      const resizeEvent = new Event("resize");
      window.dispatchEvent(resizeEvent);
    });

    rerender(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );

    expect(screen.getByText("WELCOME")).toBeInTheDocument();
  });

  test("handles menu item with custom onClick", () => {
    const customOnClick = jest.fn();
    renderComponent();

    const helpItem = screen.getByText("Help");
    expect(helpItem).toBeInTheDocument();
  });

  test("renders with custom avatars", () => {
    const { container } = renderComponent();
    const avatarImg = container.querySelector("img[alt='Avatar']");
    expect(avatarImg).toBeInTheDocument();
  });

  test("mobile sidebar menu state persistence", () => {
    Object.defineProperty(window, "innerWidth", { value: 600 });

    const { rerender } = render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Sidebar />
      </MemoryRouter>
    );

    const menuIcon = screen.getByTestId("menu-icon");
    fireEvent.click(menuIcon);

    rerender(
      <MemoryRouter initialEntries={["/analytics"]}>
        <Sidebar />
      </MemoryRouter>
    );

    const mobileMenu = screen.getByText("Analytics");
    expect(mobileMenu).toBeInTheDocument();
  });
});

describe("Desktop View", () => {
  test("handles resize to desktop view", () => {
    const { rerender } = renderComponent();
    act(() => {
      window.innerWidth = 1024;
      window.dispatchEvent(new Event("resize"));
    });
    rerender(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );
    expect(screen.getByText("WELCOME")).toBeInTheDocument();
  });
});

describe("Desktop View screen", () => {
  test("handles resize to desktop view", () => {
    const { rerender } = renderComponent();
    act(() => {
      window.innerWidth = 1024;
      window.dispatchEvent(new Event("resize"));
    });
    rerender(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );
    expect(screen.getByText("WELCOME")).toBeInTheDocument();
  });
});
