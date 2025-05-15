import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Footer from "./Footer";

// Mock the logo import
jest.mock("../assets/logo.png", () => "mocked-logo.png");

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("Footer Component", () => {
  it("renders the logo", () => {
    renderWithRouter(<Footer />);
    expect(screen.getByAltText("logo")).toBeInTheDocument();
  });

  it("renders the GitHub link", () => {
    renderWithRouter(<Footer />);
    const githubLink = screen.getByRole("link", { name: /github/i });
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute(
      "href",
      "https://github.com/chase-manning/position-book-system"
    );
  });
});
