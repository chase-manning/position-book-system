import { useQuery } from "@tanstack/react-query";

interface TradeEvent {
  ID: string;
  Action: "BUY" | "SELL" | "CANCEL";
  Account: string;
  Security: string;
  Quantity: number;
}

interface Position {
  Account: string;
  Security: string;
  Quantity: number;
  Events: TradeEvent[];
}

interface PositionsResponse {
  Positions: Position[];
}

async function fetchPositions(
  account?: string,
  security?: string
): Promise<Position[]> {
  let url = "http://localhost:8080/api/positions";
  if (account && security) {
    url = `http://localhost:8080/api/positions/${account}/${security}`;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return account && security
    ? [data as Position]
    : (data as PositionsResponse).Positions;
}

export function usePositions(account?: string, security?: string) {
  return useQuery({
    queryKey: ["positions", account, security],
    queryFn: () => fetchPositions(account, security),
  });
}
