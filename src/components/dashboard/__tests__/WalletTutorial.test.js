import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import WalletTutorial from "../WalletTutorial.jsx";

describe("WalletTutorial", () => {
  test("renders the initial tutorial step", () => {
    render(<WalletTutorial />);
    expect(screen.getByText("100% Wallet")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Explore your digital wallet! Click and drag to transfer, click to see Money Magic."
      )
    ).toBeInTheDocument();
  });

  test("navigates to the next tutorial step", () => {
    render(<WalletTutorial />);
    fireEvent.click(screen.getByText("Continue"));
    expect(screen.getByText("Real-time Transfers")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Watch your money move at the speed of light with animated transfers."
      )
    ).toBeInTheDocument();
  });

  test("navigates to the previous tutorial step", () => {
    render(<WalletTutorial />);
    fireEvent.click(screen.getByText("Continue"));
    fireEvent.click(screen.getByText("Previous"));
    expect(screen.getByText("100% Wallet")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Explore your digital wallet! Click and drag to transfer, click to see Money Magic."
      )
    ).toBeInTheDocument();
  });

  test("displays guide message for the current step", () => {
    render(<WalletTutorial />);
    expect(
      screen.getByText(
        "Try dragging to rotate the wallet and click to see it animate!"
      )
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText("Continue"));
    expect(
      screen.getByText("Click to see the coins animate across space!")
    ).toBeInTheDocument();
  });

  test("handles interaction animation", () => {
    render(<WalletTutorial />);
    const scene = screen.getByRole("button", { name: /100% Wallet/i });
    fireEvent.click(scene);
    expect(scene).toHaveClass("isAnimating");
    setTimeout(() => {
      expect(scene).not.toHaveClass("isAnimating");
    }, 1500);
  });
});
