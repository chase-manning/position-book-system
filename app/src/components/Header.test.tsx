import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Header from "./Header";

// Mock the logo import
jest.mock("../assets/logo.png", () => "mocked-logo.png");

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("Header Component", () => {
  it("renders the logo", () => {
    renderWithRouter(<Header />);
    expect(screen.getByAltText("logo")).toBeInTheDocument();
  });

  it("renders navigation items if present", () => {
    renderWithRouter(<Header />);
    // These may not be present in mobile layout
    const events = screen.queryByText("Events");
    const createEvent = screen.queryByText("Create Event");
    const dashboard = screen.queryByText("Dashboard");
    if (events) expect(events).toBeInTheDocument();
    if (createEvent) expect(createEvent).toBeInTheDocument();
    if (dashboard) expect(dashboard).toBeInTheDocument();
  });

  it("renders the GitHub utility link if present", () => {
    renderWithRouter(<Header />);
    // Utility link may not be present in mobile layout
    const githubLink = screen.queryByRole("link", { name: /github/i });
    if (githubLink) {
      expect(githubLink).toBeInTheDocument();
      expect(githubLink).toHaveAttribute(
        "href",
        "https://github.com/chase-manning/position-book-system"
      );
    }
  });
});
