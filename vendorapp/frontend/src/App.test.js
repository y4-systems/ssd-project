import { render, screen } from "@testing-library/react";
import ViewService from "../ViewService";

describe("ViewService", () => {
  test("renders ViewService component without crashing and displays service details", () => {
    const serviceDetails = {
      serviceImage: "testImage.jpg",
      serviceName: "Test Service",
      price: {
        cost: 100,
        mrp: 200,
        discountPercent: 50,
      },
      description: "This is a test service.",
      category: "Test Category",
      subcategory: "Test Subcategory",
    };

    render(<ViewService serviceDetails={serviceDetails} />);

    expect(screen.getByAltText("Test Service")).toBeInTheDocument();
    expect(screen.getByText("Test Service")).toBeInTheDocument();
    expect(screen.getByText("LKR 100")).toBeInTheDocument();
    expect(screen.getByText("LKR 200")).toBeInTheDocument();
    expect(screen.getByText("50% off")).toBeInTheDocument();
    expect(screen.getByText("This is a test service.")).toBeInTheDocument();
    expect(screen.getByText("Category: Test Category")).toBeInTheDocument();
    expect(
      screen.getByText("Subcategory: Test Subcategory")
    ).toBeInTheDocument();
  });
});
