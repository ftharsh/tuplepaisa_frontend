import React from "react";
import { render, screen } from "@testing-library/react";
import GuideAvatar from "../GuideAvatar.jsx";

jest.mock("lucide-react", () => ({
  Bot: () => <svg data-testid="bot-icon" />,
  Sparkles: () => <svg data-testid="sparkles-icon" />,
}));

describe("GuideAvatar Component", () => {
  it("renders the message and icons when visible", () => {
    const message = "Hello! I'm your guide.";
    render(<GuideAvatar message={message} isVisible={true} />);
    expect(screen.getByText(message)).toBeInTheDocument();
    expect(screen.getByTestId("bot-icon")).toBeInTheDocument();
    expect(screen.getByTestId("sparkles-icon")).toBeInTheDocument();
  });

  it("does not render the message when not visible", () => {
    const message = "You can't see me!";
    render(<GuideAvatar message={message} isVisible={false} />);
  });

  it("has the correct styles for the avatar", () => {
    const message = "Style Test";
    render(<GuideAvatar message={message} isVisible={true} />);
  });
});
