import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import LandingPage from "./LandingPage";
import { BrowserRouter, Router } from "react-router-dom";
import axios from "axios";
import { rest } from "msw";
import { setupServer } from "msw/node";

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
