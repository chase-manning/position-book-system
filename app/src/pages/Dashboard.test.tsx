import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Dashboard from "./Dashboard";
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

describe("Dashboard Page", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("shows loading state", () => {
    mockUsePositions.mockReturnValue({ isLoading: true });
    renderWithProviders(<Dashboard />);
    expect(screen.getByLabelText(/loading dashboard/i)).toBeInTheDocument();
  });

  it("shows error state", () => {
    mockUsePositions.mockReturnValue({
      isLoading: false,
      error: true,
      refetch: jest.fn(),
    });
    renderWithProviders(<Dashboard />);
    expect(screen.getByText(/failed to load dashboard/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument();
  });

  it("shows empty state when there are no positions", () => {
    mockUsePositions.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });
    renderWithProviders(<Dashboard />);
    expect(screen.getByText(/no positions found/i)).toBeInTheDocument();
  });
});
