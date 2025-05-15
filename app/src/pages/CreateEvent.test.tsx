import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter, useNavigate } from "react-router-dom";
import CreateEvent from "./CreateEvent";
import * as usePositionsModule from "../app/use-positions";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act } from "react";

jest.mock("../app/use-positions");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

const mockUsePositions = usePositionsModule.usePositions as jest.Mock;
const mockNavigate = jest.fn();
(useNavigate as jest.Mock).mockReturnValue(mockNavigate);

const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{ui}</BrowserRouter>
    </QueryClientProvider>
  );
};

describe("CreateEvent Page", () => {
  beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the form", () => {
    mockUsePositions.mockReturnValue({ data: [] });
    renderWithProviders(<CreateEvent />);
    expect(screen.getByText(/create trade event/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/account/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/security/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/quantity/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /create event/i })
    ).toBeInTheDocument();
  });

  it("shows error messages for invalid input", async () => {
    mockUsePositions.mockReturnValue({ data: [] });
    renderWithProviders(<CreateEvent />);

    // Fill in the form with invalid data
    const accountInput = screen.getByLabelText(/account/i);
    const securityInput = screen.getByLabelText(/security/i);
    const quantityInput = screen.getByLabelText(/quantity/i);

    await act(async () => {
      fireEvent.change(accountInput, { target: { value: "" } });
      fireEvent.change(securityInput, { target: { value: "" } });
      fireEvent.change(quantityInput, { target: { value: "0" } });
    });

    const submitButton = screen.getByRole("button", { name: /create event/i });
    await act(async () => {
      fireEvent.click(submitButton);
    });

    // Wait for error messages
    expect(
      await screen.findByText(/enter the account identifier/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/enter the security identifier/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/enter the quantity of the trade/i)
    ).toBeInTheDocument();
  });

  it("submits the form and navigates back to Events", async () => {
    mockUsePositions.mockReturnValue({ data: [] });
    renderWithProviders(<CreateEvent />);

    // Fill in the form with valid data
    const accountInput = screen.getByLabelText(/account/i);
    const securityInput = screen.getByLabelText(/security/i);
    const quantityInput = screen.getByLabelText(/quantity/i);

    await act(async () => {
      fireEvent.change(accountInput, { target: { value: "A1" } });
      fireEvent.change(securityInput, { target: { value: "S1" } });
      fireEvent.change(quantityInput, { target: { value: "100" } });
    });

    const submitButton = screen.getByRole("button", { name: /create event/i });
    await act(async () => {
      fireEvent.click(submitButton);
    });

    // Wait for navigation
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("navigates back to Events when cancel button clicked", () => {
    mockUsePositions.mockReturnValue({ data: [] });
    renderWithProviders(<CreateEvent />);
    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(cancelButton);
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
