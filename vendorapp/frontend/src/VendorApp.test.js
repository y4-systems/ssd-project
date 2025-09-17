import React from "react";
import { render, screen } from "@testing-library/react";
import VendorApp from "./VendorApp";

test("renders learn react link", () => {
  render(<VendorApp />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
