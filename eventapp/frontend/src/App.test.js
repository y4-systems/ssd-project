import React from "react";
import { render, screen } from "@testing-library/react";
import EventApp from "./EventApp";
import App from "./App";

test("renders learn react link", () => {
  render(<EventApp />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

test("renders learn react link for other app", () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
