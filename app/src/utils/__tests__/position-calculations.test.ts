import {
  calculatePositionMetrics,
  generatePositionSummary,
} from "../position-calculations";
import type { Position } from "../../app/use-positions";

describe("Position Calculations", () => {
  const mockPositions: Position[] = [
    {
      Account: "ACC1",
      Security: "SEC1",
      Quantity: 100,
      Events: [
        {
          ID: "1",
          Action: "BUY",
          Account: "ACC1",
          Security: "SEC1",
          Quantity: 100,
        },
      ],
    },
    {
      Account: "ACC1",
      Security: "SEC2",
      Quantity: 200,
      Events: [
        {
          ID: "2",
          Action: "BUY",
          Account: "ACC1",
          Security: "SEC2",
          Quantity: 200,
        },
      ],
    },
    {
      Account: "ACC2",
      Security: "SEC1",
      Quantity: 300,
      Events: [
        {
          ID: "3",
          Action: "BUY",
          Account: "ACC2",
          Security: "SEC1",
          Quantity: 300,
        },
      ],
    },
  ];

  describe("calculatePositionMetrics", () => {
    it("should return zero values for undefined positions", () => {
      const metrics = calculatePositionMetrics(undefined);
      expect(metrics).toEqual({
        totalPositions: 0,
        totalQuantity: 0,
        uniqueSecurities: 0,
        uniqueAccounts: 0,
      });
    });

    it("should calculate metrics correctly for given positions", () => {
      const metrics = calculatePositionMetrics(mockPositions);
      expect(metrics).toEqual({
        totalPositions: 3,
        totalQuantity: 600,
        uniqueSecurities: 2,
        uniqueAccounts: 2,
      });
    });
  });

  describe("generatePositionSummary", () => {
    it("should return empty array for undefined positions", () => {
      const summary = generatePositionSummary(undefined);
      expect(summary).toEqual([]);
    });

    it("should generate summary correctly for given positions", () => {
      const summary = generatePositionSummary(mockPositions);
      expect(summary).toEqual([
        {
          Account: "ACC1",
          Security: "SEC1",
          Quantity: 100,
          Events: 1,
        },
        {
          Account: "ACC1",
          Security: "SEC2",
          Quantity: 200,
          Events: 1,
        },
        {
          Account: "ACC2",
          Security: "SEC1",
          Quantity: 300,
          Events: 1,
        },
      ]);
    });
  });
});
