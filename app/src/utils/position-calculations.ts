import type { Position } from "../app/use-positions";

export interface PositionMetrics {
  totalPositions: number;
  totalQuantity: number;
  uniqueSecurities: number;
  uniqueAccounts: number;
}

export interface PositionSummary {
  Account: string;
  Security: string;
  Quantity: number;
  Events: number;
}

export function calculatePositionMetrics(
  positions: Position[] | undefined
): PositionMetrics {
  if (!positions) {
    return {
      totalPositions: 0,
      totalQuantity: 0,
      uniqueSecurities: 0,
      uniqueAccounts: 0,
    };
  }

  return {
    totalPositions: positions.length,
    totalQuantity: positions.reduce((sum, pos) => sum + pos.Quantity, 0),
    uniqueSecurities: new Set(positions.map((pos) => pos.Security)).size,
    uniqueAccounts: new Set(positions.map((pos) => pos.Account)).size,
  };
}

export function generatePositionSummary(
  positions: Position[] | undefined
): PositionSummary[] {
  if (!positions) {
    return [];
  }

  return positions.map((pos) => ({
    Account: pos.Account,
    Security: pos.Security,
    Quantity: pos.Quantity,
    Events: pos.Events.length,
  }));
}
