import React from "react";
import { render, screen } from "@testing-library/react";
import GuestApp from "./GuestApp";

test("renders learn react link", () => {
  render(<GuestApp />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
