import type { Square } from "chess.js";

export const MAX_GAME_PLIES = 512;
export const PROMOTIONS = ["q", "r", "b", "n"] as const;

export type ChessMove = {
  from: Square;
  to: Square;
  promotion?: (typeof PROMOTIONS)[number];
};

export function isChessMove(value: unknown): value is ChessMove {
  if (typeof value !== "object" || value === null) return false;
  const { from, to, promotion } = value as Record<string, unknown>;
  const isSquare = (square: unknown) => typeof square === "string" && /^[a-h][1-8]$/.test(square);
  return isSquare(from) && isSquare(to)
    && (promotion === undefined || PROMOTIONS.some(piece => piece === promotion));
}
