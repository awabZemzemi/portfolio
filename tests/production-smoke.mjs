import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { Chess } from "chess.js";

const child = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", "0"]);
let output = "";
const exited = once(child, "exit");

try {
  const base = await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error(`Server startup timed out\n${output}`)), 10_000);
    child.once("error", error => {
      clearTimeout(timeout);
      reject(error);
    });
    child.once("exit", code => {
      clearTimeout(timeout);
      reject(new Error(`Server exited with ${code}\n${output}`));
    });
    child.stderr.on("data", chunk => { output += chunk; });
    child.stdout.on("data", chunk => {
      output += chunk;
      const url = output.match(/http:\/\/127\.0\.0\.1:\d+/)?.[0];
      if (url && output.includes("Ready")) {
        clearTimeout(timeout);
        resolve(url);
      }
    });
  });

  const pages = [
    ["/", ["Awab Zemzemi", "/projects/aiops-agent", "/projects/second-brain", "/projects/sentinelml", 'href="/cv.pdf"', "mailto:awab.zemzemi@insat.ucar.tn", "Up for a challenge?"]],
    ["/projects/aiops-agent", ["Autonomous AIOps Agent", "Human interpretation", "CrashLoopBackOff", "Conceptual execution sequence", "data-edge-path"]],
    ["/projects/second-brain", ["Second Brain", "Follow the note ID", "31 question", "GraphRAG question answering", "Conceptual execution sequence"]],
    ["/projects/sentinelml", ["SentinelML", "0.875", "0.678", "72%", "1,496,754", "Offline Training", "Online Transaction Inference", "One project, two connected pipelines", "Saved notebook output", "https://github.com/SentineMl/MLOps", "https://github.com/SentineMl/SentinelML"]],
  ];

  for (const [path, markers] of pages) {
    const response = await fetch(base + path);
    assert.equal(response.status, 200, path);
    const html = await response.text();
    assert.ok(!html.includes("architecture-controls"), `${path} should omit video controls`);
    if (path === "/") {
      assert.match(html, /<section id="home"[^>]*>[\s\S]*?<section[^>]*aria-labelledby="hero-chess-title"[^>]*>[\s\S]*?aria-label="Chessboard"/);
      assert.doesNotMatch(html, /<footer\b[\s\S]*?Up for a challenge\?/);
    }
    for (const marker of ["<title>", 'name="description"', 'property="og:title"', ...markers]) {
      assert.ok(html.includes(marker), `${path} should contain ${marker}`);
    }
  }

  const pdf = await fetch(base + "/cv.pdf");
  assert.equal(pdf.status, 200);
  assert.match(pdf.headers.get("content-type") ?? "", /application\/pdf/);
  assert.equal(Buffer.from(await pdf.arrayBuffer()).subarray(0, 5).toString(), "%PDF-");

  for (const path of ["/icon.svg", "/robots.txt", "/sitemap.xml"]) {
    assert.equal((await fetch(base + path)).status, 200, path);
  }

  const postChess = (history) => fetch(base + "/api/chess/move", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ history }),
  });
  const opening = { from: "e2", to: "e4" };
  const response = await postChess([opening]);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "no-store");
  const { move } = await response.json();
  const game = new Chess();
  game.move(opening);
  assert.ok(move && game.moves({ verbose: true }).some(candidate =>
    candidate.from === move.from && candidate.to === move.to && candidate.promotion === move.promotion,
  ));

  assert.equal((await postChess("invalid")).status, 400);
  assert.equal((await postChess([{ from: "e2", to: "e5" }])).status, 400);
  assert.equal((await postChess([{ ...opening, promotion: "q" }])).status, 400);
  assert.equal((await postChess([opening, { from: "e7", to: "e5" }])).status, 400);
  assert.equal((await postChess("a".repeat(33 * 1024))).status, 413);

  const mate = new Chess();
  const matingHistory = ["e4", "e5", "Bc4", "Nc6", "Qh5", "Nf6", "Qxf7#"]
    .map(notation => {
      const { from, to } = mate.move(notation);
      return { from, to };
    });
  assert.ok(mate.isCheckmate());
  const terminalResponse = await postChess(matingHistory);
  assert.equal(terminalResponse.status, 200);
  assert.deepEqual(await terminalResponse.json(), { move: null });

  console.log("Production smoke tests passed for all four pages, public assets, and the chess bot.");
} finally {
  child.kill();
  await exited;
}
