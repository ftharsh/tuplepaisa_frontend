import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Button from "../Button.jsx";
import { THEME } from "../../../../Constant/theme.js";

describe("Button component", () => {
  test("renders default variant correctly", () => {
    render(<Button>Default Button</Button>);
    const buttonElement = screen.getByText("Default Button");
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveClass(
      "px-4 py-2 rounded-lg font-medium transition-colors duration-200"
    );
    expect(buttonElement).toHaveClass(`bg-[${THEME.primary}]`);
    expect(buttonElement).toHaveClass("text-white");
  });

  test("renders ghost variant correctly", () => {
    render(<Button variant="ghost">Ghost Button</Button>);
    const buttonElement = screen.getByText("Ghost Button");
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveClass(
      "bg-transparent text-gray-300 hover:text-white hover:bg-gray-800"
    );
  });

  test("renders disabled state correctly", () => {
    render(<Button disabled>Disabled Button</Button>);
    const buttonElement = screen.getByText("Disabled Button");
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveClass("opacity-50 cursor-not-allowed");
    expect(buttonElement).toBeDisabled();
  });

  test("applies additional class names", () => {
    render(<Button className="extra-class">Button with Extra Class</Button>);
    const buttonElement = screen.getByText("Button with Extra Class");
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveClass("extra-class");
  });
});
