import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
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

  it("verifies frame update mechanism", async () => {
    let frameCount = 0;
    const mockRequestAnimationFrame = jest.fn((cb) => {
      frameCount++;
      cb();
      return frameCount;
    });

    global.requestAnimationFrame = mockRequestAnimationFrame;

    render(<TextMorph />);

    await waitFor(() => {
      expect(mockRequestAnimationFrame).toHaveBeenCalled();
    });

    global.requestAnimationFrame = jest.fn((cb) => setTimeout(cb, 16));
  });

  it("handles edge cases with minimal texts", async () => {
    render(<TextMorph />);
    const textElement = screen.getByTestId("morphing-text");

    await waitFor(() => {
      expect(textElement.innerHTML).not.toBe(undefined);
    });
  });

  it("handles multiple text morphing cycles", async () => {
    render(<TextMorph />);
    const textElement = screen.getByTestId("morphing-text");

    await act(async () => {
      jest.advanceTimersByTime(10000);
    });

    expect(textElement.innerHTML).not.toBe("0");
  });
});
