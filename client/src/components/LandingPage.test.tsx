import { render, screen } from "@testing-library/react";
import LandingPage from "./LandingPage";

describe("LandingPage", () => {
  test("renders a heading", () => {
    render(<LandingPage />);
    const headingElement = screen.getByRole("heading", { name: /Moody/i });
    expect(headingElement).toBeInTheDocument();
  });

  test("renders a paragraph", () => {
    render(<LandingPage />);
    const paragraph = screen.getByText(
      "Looking for music inspiration based on your mood? Let's get started!"
    );
    expect(paragraph).toBeInTheDocument();
  });
});
