/* eslint-disable testing-library/no-container */
import React from "react";
import { render, act } from "@testing-library/react";
import TransactionEffects from "../TransitionEffect";

jest.useFakeTimers();

describe("TransactionEffects", () => {
  const mockOnFinish = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  test("renders nothing when show is false", () => {
    const { container } = render(
      <TransactionEffects show={false} onFinish={mockOnFinish} />
    );
    expect(container.firstChild).toBeNull();
  });

  test("renders loading overlay when show is true", () => {
    const { getByText, getByTestId } = render(
      <TransactionEffects show={true} onFinish={mockOnFinish} />
    );
    expect(getByText("Processing your request...")).toBeInTheDocument();
    expect(document.querySelector(".animate-spin")).toBeInTheDocument();
  });
  test("calls onFinish exactly once after 2 seconds when show is true", () => {
    render(<TransactionEffects show={true} onFinish={mockOnFinish} />);

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(mockOnFinish).toHaveBeenCalledTimes(1);
  });

  test("does not call onFinish when show changes to false", () => {
    const { rerender } = render(
      <TransactionEffects show={true} onFinish={mockOnFinish} />
    );

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    rerender(<TransactionEffects show={false} onFinish={mockOnFinish} />);

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(mockOnFinish).toHaveBeenCalledTimes(1);
  });

  test("renders with correct classes and structure", () => {
    const { container } = render(
      <TransactionEffects show={true} onFinish={mockOnFinish} />
    );

    // eslint-disable-next-line testing-library/no-node-access
    const overlayDiv = container.firstChild;
    // eslint-disable-next-line testing-library/no-node-access
    const contentDiv = container.querySelector(".bg-white");
    // eslint-disable-next-line testing-library/no-node-access
    const spinnerDiv = container.querySelector(".animate-spin");
    // eslint-disable-next-line testing-library/no-node-access
    const textElement = container.querySelector(".text-gray-700");

    expect(overlayDiv).toHaveClass(
      "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    );
    expect(contentDiv).toHaveClass(
      "bg-white rounded-2xl p-8 flex flex-col items-center"
    );
    expect(spinnerDiv).toHaveClass(
      "w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"
    );
    expect(textElement).toHaveClass("text-gray-700 font-medium");
    expect(textElement).toHaveTextContent("Processing your request...");
  });
});
