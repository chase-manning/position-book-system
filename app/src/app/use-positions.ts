import { useState, useEffect } from "react";

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

export function usePositions(account?: string, security?: string) {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        setLoading(true);
        setError(null);

        let url = "http://localhost:8080/api/positions";
        if (account && security) {
          url = `http://localhost:8080/api/positions/${account}/${security}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (account && security) {
          // Single position response
          setPositions([data as Position]);
        } else {
          // Multiple positions response
          setPositions((data as PositionsResponse).Positions);
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred while fetching positions"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPositions();
  }, [account, security]);

  return { positions, loading, error };
}
