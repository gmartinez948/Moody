import { render, screen, fireEvent } from "@testing-library/react";
import Genres from "./Genres";

describe("LandingPage", () => {
  const genres = ["Pop", "Hip-Hop", "Rock", "R&B/Soul", "Indie"];
  test("renders a heading", () => {
    render(<Genres />);
    const headingElement = screen.getByRole("heading", {
      name: /First, let's get to know your taste in genres/i,
    });
    expect(headingElement).toBeInTheDocument();
  });

  test("renders a new page if 5 genres are clicked", () => {
    render(<Genres />);
    const headingElement = screen.getByRole("heading", {
      name: /First, let's get to know your taste in genres/i,
    });
    for (let i = 0; i < genres.length; i++) {
      const genreButton = screen.getByRole("button", { name: genres[i] });
      fireEvent.click(genreButton);
    }

    expect(headingElement).not.toBeInTheDocument();
  });

  test("does not render submit button when page loads", () => {
    render(<Genres />);
    const submitButton = screen.queryByRole("button", { name: "Submit" });
    expect(submitButton).toBeNull();
  });

  test("renders a Submit button once one genre is clicked", () => {
    render(<Genres />);
    const genreButton = screen.getByRole("button", { name: genres[0] });
    fireEvent.click(genreButton);
    const submitButton = screen.queryByRole("button", { name: "Submit" });
    expect(submitButton).toBeInTheDocument();
  });

  test("renders a new page when submit button is clicked", () => {
    render(<Genres />);
    const headingElement = screen.getByRole("heading", {
      name: /First, let's get to know your taste in genres/i,
    });
    const genreButton = screen.getByRole("button", { name: genres[0] });
    fireEvent.click(genreButton);
    const submitButton = screen.queryByRole("button", { name: "Submit" });
    fireEvent.click(submitButton as HTMLElement);
    expect(headingElement).not.toBeInTheDocument();
  });
});
