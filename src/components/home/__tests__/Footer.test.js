import React from "react";
import { render, screen } from "@testing-library/react";
import Footer from "../Footer";

describe("Footer Component", () => {
  it("renders the footer section", () => {
    render(<Footer />);
    const footerElement = screen.getByRole("contentinfo");
    expect(footerElement).toBeInTheDocument();
  });

  it("renders the wave images", () => {
    render(<Footer />);
    const waveImages = screen.getAllByAltText(/Wave Pattern/i);
    expect(waveImages).toHaveLength(2);
  });

  it("renders all review logos with quotes", () => {
    render(<Footer />);
    const reviewLogos = screen.getAllByRole("img", { name: /Bloomberg logo/i });
    expect(reviewLogos).toHaveLength(4);
    const quotes = screen.getAllByText(
      /The Next-gen platform|A young and hip transformation|Fresh and bold|Seamlessly modern/i
    );
    expect(quotes).toHaveLength(4);
  });

  it("renders contact information", () => {
    render(<Footer />);
    expect(screen.getByText(/Contact Us/i)).toBeInTheDocument();
    expect(screen.getByText(/harsh@tuplepaisa.com/i)).toBeInTheDocument();
    expect(screen.getByText(/Mythic Centre,/i)).toBeInTheDocument();
  });

  it("renders the about us section", () => {
    render(<Footer />);
    expect(screen.getByText(/About Us/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        /We're not your parents' finance app. who've survived on instant noodles/i
      )
    ).toBeInTheDocument();
  });

  it("renders the newsletter section", () => {
    render(<Footer />);
    expect(screen.getByText(/WANT TO BE THE SMARTEST/i)).toBeInTheDocument();
    expect(screen.getByText(/SIGN UP FOR OUR NEWSLETTER/i)).toBeInTheDocument();
  });
});
