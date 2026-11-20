import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { aiopsDiagram } from "../src/components/architecture/aiops-data.ts";
import { ingestionDiagram, retrievalDiagram } from "../src/components/architecture/knowledge-data.ts";
import { resolveSiteOrigin } from "../src/config/site.ts";

for (const diagram of [aiopsDiagram, ingestionDiagram, retrievalDiagram]) {
  test(`${diagram.title} has valid layout, edge, and playback references`, () => {
    const ids = diagram.nodes.map(node => node.id);
    const edges = diagram.edges.map(edge => edge.id);
    assert.equal(ids.length, new Set(ids).size);
    assert.equal(edges.length, new Set(edges).size);
    for (const { boxes, size: [width, height] } of Object.values(diagram.layouts)) {
      assert.deepEqual(Object.keys(boxes).sort(), [...ids].sort());
      for (const [x, y, w, h] of Object.values(boxes)) {
        assert.ok(x >= 0 && y >= 0 && w > 0 && h > 0 && x + w <= width && y + h <= height);
      }
    }
    for (const edge of diagram.edges) {
      assert.ok(ids.includes(edge.from) && ids.includes(edge.to));
    }
    for (const step of diagram.steps) {
      assert.ok(step.nodes.every(id => ids.includes(id)) && (step.edges ?? []).every(id => edges.includes(id)));
    }
  });
}

test("keeps live Kind data separate from the unsent request and human interpretation", () => {
  const evidence = JSON.parse(readFileSync(new URL("../docs/aiops-demo/evidence.json", import.meta.url), "utf8"));
  const [request, tools, snapshot, interpretation, result] = evidence.stages;
  assert.equal(request.submitted, false);
  assert.equal(tools.agentSelectedTools, null);
  assert.equal(snapshot.provenance, "live-kind-snapshot");
  assert.equal(snapshot.containers[0].state.reason, "CrashLoopBackOff");
  assert.equal(interpretation.agentAnswer, null);
  assert.equal(result.investigationId, null);
  assert.equal(result.apiResponseMetadata, null);
});

test("only accepts a plain HTTPS origin for public metadata", () => {
  assert.equal(resolveSiteOrigin(undefined), undefined);
  assert.equal(resolveSiteOrigin("http://site.example"), undefined);
  assert.equal(resolveSiteOrigin("https://site.example/private"), undefined);
  assert.equal(resolveSiteOrigin("https://user@site.example"), undefined);
  assert.equal(resolveSiteOrigin("https://site.example/?query=example"), undefined);
  assert.equal(resolveSiteOrigin("https://site.example/"), "https://site.example");
});
