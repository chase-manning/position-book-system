import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Events from "./Events";
import * as usePositionsModule from "../app/use-positions";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

jest.mock("../app/use-positions");

const mockUsePositions = usePositionsModule.usePositions as jest.Mock;

const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{ui}</BrowserRouter>
    </QueryClientProvider>
  );
};

describe("Events Page", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("shows loading state", () => {
    mockUsePositions.mockReturnValue({ isLoading: true });
    renderWithProviders(<Events />);
    expect(screen.getByLabelText(/loading positions/i)).toBeInTheDocument();
  });

  it("shows error state", () => {
    mockUsePositions.mockReturnValue({
      isLoading: false,
      error: true,
      refetch: jest.fn(),
    });
    renderWithProviders(<Events />);
    expect(screen.getByText(/failed to load positions/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument();
  });

  it("shows empty state when there are no events", () => {
    mockUsePositions.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });
    renderWithProviders(<Events />);
    expect(screen.getByText(/no events found/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /create event/i })
    ).toBeInTheDocument();
  });

  it("navigates to create event page when button clicked", () => {
    mockUsePositions.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });
    renderWithProviders(<Events />);
    const button = screen.getByRole("button", { name: /create event/i });
    fireEvent.click(button);
    expect(button).toBeEnabled();
  });
});
