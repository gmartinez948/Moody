import { render, screen, fireEvent } from "@testing-library/react";
import Genres from "./Genres";

describe("LandingPage", () => {
  test("renders a heading", () => {
    render(<Genres />);
    const headingElement = screen.getByRole("heading", {
      name: /First, let's get to know your taste in genres/i,
    });
    expect(headingElement).toBeInTheDocument();
  });

  test("renders a new page if 5 genres are clicked", () => {
    const genres = ["Pop", "Hip-Hop", "Rock", "R&B/Soul", "Indie"];
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
});
