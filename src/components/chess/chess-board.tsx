import { type Chess, type Square } from "chess.js";
import { ChessBishop, ChessKing, ChessKnight, ChessPawn, ChessQueen, ChessRook } from "lucide-react";
import { useState, type KeyboardEvent, type RefObject } from "react";
import type { ChessMove } from "@/lib/chess-game";
import styles from "./chess.module.css";

const icons = { p: ChessPawn, n: ChessKnight, b: ChessBishop, r: ChessRook, q: ChessQueen, k: ChessKing };
export const pieceNames = { p: "Pawn", n: "Knight", b: "Bishop", r: "Rook", q: "Queen", k: "King" };

export function focusSquare(grid: HTMLElement | null, square: Square) {
  grid?.querySelector<HTMLButtonElement>(`[data-square="${square}"]`)?.focus({ preventScroll: true });
}

export function ChessBoard({ game, selected, targets, lastMove, locked, grid, onSelect, onClear }: {
  game: Chess;
  selected: Square | null;
  targets: ReadonlySet<Square>;
  lastMove?: ChessMove;
  locked: boolean;
  grid: RefObject<HTMLDivElement | null>;
  onSelect: (square: Square) => void;
  onClear: () => void;
}) {
  const [focused, setFocused] = useState<Square>("e2");
  const check = game.isCheck();
  const botDestination = game.turn() === "w" ? lastMove?.to : undefined;

  function navigate(event: KeyboardEvent, row: number, column: number) {
    let nextRow = row;
    let nextColumn = column;
    switch (event.key) {
      case "ArrowUp": nextRow--; break;
      case "ArrowDown": nextRow++; break;
      case "ArrowLeft": nextColumn--; break;
      case "ArrowRight": nextColumn++; break;
      case "Home": nextColumn = 0; break;
      case "End": nextColumn = 7; break;
      case "Escape": onClear(); return;
      default: return;
    }
    event.preventDefault();
    if (nextRow < 0 || nextRow > 7 || nextColumn < 0 || nextColumn > 7) return;
    focusSquare(grid.current, `${"abcdefgh"[nextColumn]}${8 - nextRow}` as Square);
  }

  return (
    <div ref={grid} role="grid" aria-label="Chessboard" aria-describedby="chess-instructions" className={styles.board}>
      {game.board().map((row, rowIndex) => (
        <div role="row" className={styles.boardRow} key={8 - rowIndex}>
          {row.map((piece, column) => {
            const file = "abcdefgh"[column];
            const rank = 8 - rowIndex;
            const square = `${file}${rank}` as Square;
            const Icon = piece && icons[piece.type];
            const legal = targets.has(square);
            const checkedKing = check && piece?.type === "k" && piece.color === game.turn();
            const occupant = piece ? `${piece.color === "w" ? "White" : "Black"} ${pieceNames[piece.type].toLowerCase()}` : "empty";

            return (
              <div role="gridcell" aria-selected={selected === square} key={square}>
                <button
                  type="button"
                  aria-label={`${square}, ${occupant}${legal ? ", legal destination" : ""}${checkedKing ? ", in check" : ""}`}
                  aria-disabled={locked || undefined}
                  tabIndex={focused === square ? 0 : -1}
                  data-square={square}
                  data-tone={(rowIndex + column) % 2 ? "dark" : "light"}
                  data-selected={selected === square || undefined}
                  data-last={lastMove?.from === square || lastMove?.to === square || undefined}
                  data-bot-arrival={botDestination === square || undefined}
                  data-check={checkedKing || undefined}
                  onFocus={() => setFocused(square)}
                  onClick={() => onSelect(square)}
                  onKeyDown={event => navigate(event, rowIndex, column)}
                  className={styles.square}
                >
                  {column === 0 && <span aria-hidden="true" className={styles.rank}>{rank}</span>}
                  {rowIndex === 7 && <span aria-hidden="true" className={styles.file}>{file}</span>}
                  {Icon && <Icon className={styles.piece} data-side={piece.color} strokeWidth={1.7} aria-hidden="true" />}
                  {legal && <span aria-hidden="true" className={piece ? styles.capture : styles.destination} />}
                </button>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
