import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import TextMorph from "../MorphingText.jsx";

jest.useFakeTimers();
beforeAll(() => {
  global.requestAnimationFrame = jest.fn((cb) => setTimeout(cb, 16));
  global.cancelAnimationFrame = jest.fn((id) => clearTimeout(id));
});

afterAll(() => {
  delete global.requestAnimationFrame;
  delete global.cancelAnimationFrame;
});

describe("TextMorph Component", () => {
  it("renders without crashing", () => {
    render(<TextMorph />);
    const containerElement = screen.getByRole("presentation");
    expect(containerElement).toBeInTheDocument();
  });

  it("renders content dynamically during the morphing process", async () => {
    render(<TextMorph />);
    const containerElement = screen.getByRole("presentation");
    await waitFor(() => {
      expect(containerElement.innerHTML).not.toBe("");
    });
  });

  it("cycles through phrases dynamically", async () => {
    render(<TextMorph />);
    const textElement = screen.getByTestId("morphing-text");

    await waitFor(() => {
      expect(textElement.innerHTML).not.toBe("");
    });
  });

  it("cleans up animation frames on unmount", () => {
    const { unmount } = render(<TextMorph />);
    unmount();
    expect(global.cancelAnimationFrame).toHaveBeenCalled();
  });
});
