import React from "react";
import { render, act } from "@testing-library/react";
import ParticleBackground from "../ParticleBackground.jsx";
import * as d3 from "d3";

const originalWindow = { ...window };
const mockResizeEvent = new Event("resize");

describe("ParticleBackground", () => {
  beforeEach(() => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });
    Object.defineProperty(window, "innerHeight", {
      writable: true,
      configurable: true,
      value: 768,
    });

    d3.range.mockReturnValue(Array(50).fill(null));
  });

  afterEach(() => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: originalWindow.innerWidth,
    });
    Object.defineProperty(window, "innerHeight", {
      writable: true,
      configurable: true,
      value: originalWindow.innerHeight,
    });

    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    render(<ParticleBackground />);
  });

  it("creates SVG container with correct attributes", () => {
    render(<ParticleBackground />);

    expect(d3.select).toHaveBeenCalled();
    const selectMock = d3.select();

    expect(selectMock.attr).toHaveBeenCalledWith("width", 1024);
    expect(selectMock.attr).toHaveBeenCalledWith("height", 768);
    expect(selectMock.style).toHaveBeenCalledWith("position", "fixed");
    expect(selectMock.style).toHaveBeenCalledWith("top", 0);
    expect(selectMock.style).toHaveBeenCalledWith("left", 0);
    expect(selectMock.style).toHaveBeenCalledWith("z-index", 0);
    expect(selectMock.style).toHaveBeenCalledWith("pointer-events", "none");
  });

  it("creates correct number of particles", () => {
    render(<ParticleBackground />);
    expect(d3.range).toHaveBeenCalledWith(50);
  });

  it("handles window resize", () => {
    render(<ParticleBackground />);

    act(() => {
      window.innerWidth = 800;
      window.innerHeight = 600;
      window.dispatchEvent(mockResizeEvent);
    });

    const selectMock = d3.select();
    expect(selectMock.attr).toHaveBeenCalledWith("width", 800);
    expect(selectMock.attr).toHaveBeenCalledWith("height", 600);
  });

  it("cleans up on unmount", () => {
    const { unmount } = render(<ParticleBackground />);
    const intervalInstance = d3.interval();

    unmount();
    expect(intervalInstance.stop).toHaveBeenCalled();
  });
});
