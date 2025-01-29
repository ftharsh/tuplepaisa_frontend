import React from "react";
import { render, screen } from "@testing-library/react";
import { useProgress } from "@react-three/drei";
import { Loader } from "../Loader.jsx";
import "@testing-library/jest-dom";

jest.mock("@react-three/drei", () => ({
  Html: ({ children }) => <div>{children}</div>,
  useProgress: jest.fn(),
}));

describe("Loader Component", () => {
  it("renders loading spinner and progress text correctly", () => {
    const mockProgress = 75;
    useProgress.mockReturnValue({ progress: mockProgress });
    render(<Loader />);
    expect(screen.getByText(`Loading... ${mockProgress}%`)).toBeInTheDocument();
  });
});
