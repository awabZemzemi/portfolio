import { Chess } from "chess.js";
import { isChessMove, MAX_GAME_PLIES, type ChessMove } from "@/lib/chess-game";

const MAX_BODY_BYTES = 32 * 1024;

function reply(body: { move: ChessMove | null } | { error: string }, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  if (!request.body) return reply({ error: "A move history is required." }, 400);

  const reader = request.body.getReader();
  const decoder = new TextDecoder("utf-8", { fatal: true });
  let bytes = 0;
  let body = "";
  let payload: unknown;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > MAX_BODY_BYTES) {
        void reader.cancel().catch(() => {});
        return reply({ error: "Move history is too large." }, 413);
      }
      body += decoder.decode(value, { stream: true });
    }
    payload = JSON.parse(body + decoder.decode());
  } catch {
    return reply({ error: "Invalid JSON request." }, 400);
  } finally {
    reader.releaseLock();
  }

  const history = payload && typeof payload === "object" && "history" in payload ? payload.history : undefined;
  if (!Array.isArray(history) || history.length % 2 !== 1
    || history.length >= MAX_GAME_PLIES || !history.every(isChessMove)) {
    return reply({ error: "Send a valid move history ending with White's move." }, 400);
  }

  const game = new Chess();
  try {
    for (const { from, to, promotion } of history) {
      if (game.isGameOver()) return reply({ error: "The game has already ended." }, 400);
      const actual = game.move({ from, to, promotion });
      if (actual.promotion !== promotion) return reply({ error: "Invalid promotion." }, 400);
    }
  } catch {
    return reply({ error: "The history contains an illegal move." }, 400);
  }

  if (game.isGameOver()) return reply({ move: null });
  const moves = game.moves({ verbose: true });
  const { from, to, promotion } = moves[Math.floor(Math.random() * moves.length)];
  const move = { from, to, promotion };
  return isChessMove(move) ? reply({ move }) : reply({ error: "Invalid bot move." }, 500);
}
