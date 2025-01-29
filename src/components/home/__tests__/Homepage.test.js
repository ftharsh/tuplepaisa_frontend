import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useNavigate } from "react-router-dom";
import Homepage from "../Homepage.jsx";
import "@testing-library/jest-dom";
import Footer from "../Footer.jsx";

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

jest.mock("lottie-react", () => ({
  __esModule: true,
  default: () => <div data-testid="lottie-animation">Lottie Animation</div>,
}));

jest.mock("../../media/images/tuple paisa logo.png", () => "mocked-logo");
jest.mock("../../media/images/head_image.jpeg", () => "mocked-head-image");
jest.mock("../../media/images/wave.png", () => "mocked-wave");
jest.mock("../../media/images/preloader.png", () => "mocked-preloader");
jest.mock("../../css/homepage.css", () => ({}));

describe("Homepage Component", () => {
  let mockNavigate;

  beforeEach(() => {
    mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders without crashing", () => {
    render(<Homepage />);
    expect(screen.getByAltText("Appheading")).toBeInTheDocument();
  });

  test("navigates to auth page when sign in button is clicked", () => {
    render(<Homepage />);
    const signInButton = screen.getByText("Sign In");

    fireEvent.click(signInButton);

    expect(mockNavigate).toHaveBeenCalledWith("/authpage");
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });

  test("renders main heading text correctly", () => {
    render(<Homepage />);

    expect(screen.getByText("all that you")).toBeInTheDocument();
    expect(screen.getByText("deserve.")).toBeInTheDocument();
    expect(screen.getByText("and some")).toBeInTheDocument();
    expect(screen.getByText("more.")).toBeInTheDocument();
  });

  test("renders wallet section content correctly", () => {
    render(<Homepage />);

    expect(screen.getByText(/building/i)).toBeInTheDocument();
    expect(screen.getByText(/PAYMENTS/i)).toBeInTheDocument();
    expect(screen.getByText(/100%/i)).toBeInTheDocument();
    expect(screen.getByText(/flash/i)).toBeInTheDocument();
  });

  test("renders Lottie animation component", () => {
    render(<Homepage />);

    expect(screen.getByTestId("lottie-animation")).toBeInTheDocument();
  });

  test("renders all required images", () => {
    render(<Homepage />);

    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(9);

    expect(screen.getByAltText("logo")).toBeInTheDocument();
  });
  it("should render the footer when showFooter is true", () => {
    render(<Footer showFooter={true} />);
  });
});
