import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter as Router } from "react-router-dom";
import Card from "../ReportCard.jsx";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("Card Component", () => {
  beforeEach(() => {
    mockedNavigate.mockClear();
  });

  test("renders Card component correctly", () => {
    render(
      <Router>
        <Card />
      </Router>
    );

    expect(screen.getByText("Monthly Report")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Retrieve report, analyze key data for informed strategic decisions."
      )
    ).toBeInTheDocument();
    expect(screen.getByText("Analyze This")).toBeInTheDocument();
  });

  test("navigates to /analytics when Analyze This button is clicked", () => {
    render(
      <Router>
        <Card />
      </Router>
    );

    fireEvent.click(screen.getByText("Analyze This"));
    expect(mockedNavigate).toHaveBeenCalledWith("/analytics");
  });
});
