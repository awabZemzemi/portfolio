import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";

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
    ["/", ["Awab Zemzemi", "/projects/aiops-agent", "/projects/second-brain", 'href="/cv.pdf"', "mailto:awab.zemzemi@insat.ucar.tn"]],
    ["/projects/aiops-agent", ["Autonomous AIOps Agent", "Human interpretation", "CrashLoopBackOff", "Conceptual execution sequence", "data-edge-path"]],
    ["/projects/second-brain", ["Second Brain", "Follow the note ID", "31 question", "GraphRAG question answering", "Conceptual execution sequence"]],
    ["/projects/sentinelml", ["SentinelML", "0.875", "0.678", "72%", "1,496,754", "Online transaction inference", "Training, tracking, and packaging", "Reported offline evaluation"]],
  ];

  for (const [path, markers] of pages) {
    const response = await fetch(base + path);
    assert.equal(response.status, 200, path);
    const html = await response.text();
    assert.ok(!html.includes("architecture-controls"), `${path} should omit video controls`);
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
  console.log("Production smoke tests passed for all four pages, CV, favicon, robots, and sitemap.");
} finally {
  child.kill();
  await exited;
}
