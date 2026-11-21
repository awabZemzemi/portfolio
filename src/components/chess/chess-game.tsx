"use client";

import { Chess, type Square } from "chess.js";
import { useEffect, useMemo, useRef, useState } from "react";
import { isChessMove, MAX_GAME_PLIES, PROMOTIONS, type ChessMove } from "@/lib/chess-game";
import { ChessBoard, focusSquare, pieceNames } from "./chess-board";
import styles from "./chess.module.css";

const BOT_MOVE_PAUSE_MS = 400;

function waitForBotPace(startedAt: number, signal: AbortSignal) {
  const remaining = BOT_MOVE_PAUSE_MS - (performance.now() - startedAt);
  if (remaining <= 0 || signal.aborted) return;

  return new Promise<void>(resolve => {
    function finish() {
      window.clearTimeout(timer);
      signal.removeEventListener("abort", finish);
      resolve();
    }

    const timer = window.setTimeout(finish, remaining);
    signal.addEventListener("abort", finish, { once: true });
  });
}

function replay(history: readonly ChessMove[]) {
  const game = new Chess();
  for (const move of history) game.move(move);
  return game;
}

function gameResult(game: Chess, moveCount: number) {
  if (game.isCheckmate()) return game.turn() === "b" ? "Checkmate. You win!" : "Checkmate. The bot wins!";
  if (game.isStalemate()) return "Draw by stalemate.";
  if (game.isThreefoldRepetition()) return "Draw by threefold repetition.";
  if (game.isInsufficientMaterial()) return "Draw by insufficient material.";
  if (game.isDrawByFiftyMoves()) return "Draw by the fifty-move rule.";
  if (moveCount >= MAX_GAME_PLIES) return "This game reached the move limit. Start a new one to keep playing.";
}

export default function ChessGame() {
  const [history, setHistory] = useState<ChessMove[]>([]);
  const [selected, setSelected] = useState<Square | null>(null);
  const [promotion, setPromotion] = useState<ChessMove | null>(null);
  const [waiting, setWaiting] = useState(false);
  const [failed, setFailed] = useState(false);
  const request = useRef<AbortController | null>(null);
  const grid = useRef<HTMLDivElement>(null);
  const firstPromotion = useRef<HTMLButtonElement>(null);

  useEffect(() => () => {
    const pending = request.current;
    request.current = null;
    pending?.abort();
  }, []);

  useEffect(() => {
    if (promotion) firstPromotion.current?.focus();
  }, [promotion]);

  const game = useMemo(() => replay(history), [history]);
  const result = gameResult(game, history.length);
  const locked = Boolean(result || waiting || promotion || game.turn() !== "w");
  const moves = selected ? game.moves({ square: selected, verbose: true }) : [];
  const targets = new Set(moves.map(move => move.to));
  const lastMove = history.at(-1);

  async function requestBotMove(nextHistory: ChessMove[]) {
    if (request.current) return;
    const controller = new AbortController();
    const startedAt = performance.now();
    request.current = controller;
    setWaiting(true);
    setFailed(false);

    const timeout = window.setTimeout(() => controller.abort(), 8000);
    try {
      const response = await fetch("/api/chess/move", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history: nextHistory }),
        signal: controller.signal,
      });
      if (!response.ok) throw new Error("Bot request failed");
      const payload: unknown = await response.json();
      if (request.current !== controller) return;
      if (!payload || typeof payload !== "object" || !("move" in payload)) throw new Error("Invalid bot reply");

      const position = replay(nextHistory);
      if (position.isGameOver() && payload.move === null) return;
      if (position.isGameOver() || !isChessMove(payload.move)) throw new Error("Invalid bot move");

      const actual = position.move(payload.move);
      if (actual.promotion !== payload.move.promotion) throw new Error("Invalid bot promotion");
      await waitForBotPace(startedAt, controller.signal);
      if (request.current !== controller) return;
      controller.signal.throwIfAborted();
      setHistory([...nextHistory, payload.move]);
    } catch {
      if (request.current === controller) setFailed(true);
    } finally {
      window.clearTimeout(timeout);
      if (request.current === controller) {
        request.current = null;
        setWaiting(false);
      }
    }
  }

  function play(move: ChessMove) {
    const nextHistory = [...history, move];
    setHistory(nextHistory);
    setSelected(null);
    setPromotion(null);
    void requestBotMove(nextHistory);
  }

  function pickSquare(square: Square) {
    if (locked || request.current) return;
    const move = moves.find(candidate => candidate.to === square);
    if (move) {
      const pending = { from: move.from, to: move.to };
      if (move.promotion) setPromotion(pending);
      else play(pending);
      return;
    }
    setSelected(selected !== square && game.get(square)?.color === "w" ? square : null);
  }

  function newGame() {
    const pending = request.current;
    request.current = null;
    pending?.abort();
    setHistory([]);
    setSelected(null);
    setPromotion(null);
    setWaiting(false);
    setFailed(false);
  }

  function cancelPromotion() {
    if (promotion) focusSquare(grid.current, promotion.from);
    setPromotion(null);
  }

  const status = result
    ?? (promotion ? "Choose a piece for your pawn." : null)
    ?? (waiting ? "Bot is thinking…" : null)
    ?? (failed ? "The bot didn’t reply. Your move is still on the board." : null)
    ?? (game.isCheck() ? "You’re in check. Your move." : null)
    ?? (lastMove ? `Bot played ${lastMove.from} to ${lastMove.to}. Your move.` : "You're White. Your move.");

  return (
    <section className={styles.game} aria-labelledby="hero-chess-title">
      <div className={styles.heading}>
        <h2 id="hero-chess-title">Up for a challenge?</h2>
        <button className={styles.reset} type="button" onClick={newGame}>New game</button>
      </div>
      <p className={styles.subtitle}>If I win, you hire me. If you win, I&apos;ll settle for an interview.</p>
      <p id="chess-instructions" className="sr-only">Play White against the bot. Use the arrow keys to move between squares. Press Enter or Space to select a piece or move it. Press Escape to clear a selection.</p>
      <ChessBoard
        game={game}
        selected={selected}
        targets={targets}
        lastMove={lastMove}
        locked={locked}
        grid={grid}
        onSelect={pickSquare}
        onClear={() => setSelected(null)}
      />
      <div className={styles.feedback}>
        <p className={styles.status} role="status" aria-atomic="true">{status}</p>
        {promotion && (
          <div className={styles.promotion} role="group" aria-label="Promote pawn" onKeyDown={event => {
            if (event.key === "Escape") cancelPromotion();
          }}>
            {PROMOTIONS.map((piece, index) => (
              <button key={piece} ref={index === 0 ? firstPromotion : undefined} type="button" onClick={() => {
                focusSquare(grid.current, promotion.to);
                play({ ...promotion, promotion: piece });
              }}>{pieceNames[piece]}</button>
            ))}
            <button type="button" onClick={cancelPromotion}>Cancel</button>
          </div>
        )}
        {failed && !result && <button className={styles.retry} type="button" onClick={() => {
          if (lastMove) focusSquare(grid.current, lastMove.to);
          void requestBotMove(history);
        }}>Retry bot move</button>}
      </div>
    </section>
  );
}
