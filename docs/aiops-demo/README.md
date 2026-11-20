# AIOps CrashLoopBackOff demonstration

[evidence.json](evidence.json) contains a live capture from the existing Kind lab, plus independently verified test results. The project’s restricted ServiceAccount read the intentionally failing `aiops/crash-demo` fixture through the diagnostic CLI. The example HTTP request was not submitted. The interpretation is a human review of the fixture and the collector output. There is no model answer, agent-selected tool trace, investigation ID, or response metadata in this capture.

The AIOps source was checked in the neighboring `AiOps` checkout at revision `908de7bc865b110278272548dfad24280657fb1b`. All implementation paths below are relative to that checkout.

## What the capture establishes

- The Pod phase was `Running`, but `crashing-container` was unready and waiting in `CrashLoopBackOff`. Its previous termination had exit code 1, and Kubernetes reported a warning Event with reason `BackOff`.
- Current and previous log streams contained the same two scripted lines. The manifest prints the database connection error before explicitly exiting. The line is evidence of what the script printed, while the manifest explains the deliberate failure.
- Metrics collection returned HTTP 404. The capture provides no CPU or memory sample and does not establish why the resource was unavailable.
- Live access reviews allowed Pod log reads in `aiops`, denied Pod deletion in `aiops`, and denied Pod listing in `default`. The reviews asked the API about permissions without attempting any deletion.
- The opt-in `test_crash_demo` integration test passed against Kind. The separate offline discovery run passed 127 tests and skipped that one opt-in live test. The offline cases verify application and graph behavior with test doubles where applicable.

The dataset retains the lab target names, selected Pod and container fields, exact fixture log text without timestamps, selected Event fields, and the safe metrics error. It omits credentials, environment values, internal addresses, node names, object UIDs, raw Event messages, and full trace logs. Event and restart counts describe this point-in-time lab snapshot.

## Implementation and claim references

| Claim | AIOps source and verification |
| --- | --- |
| Authenticated investigation | `backend/investigations/routes.py` defines `POST /agent/investigate`. `backend/investigations/schemas.py` requires a nonblank message and validates an optional namespace. `backend/auth/dependencies.py` resolves a bearer JWT to an active admin or operator and reloads current permissions. A supplied namespace must be allowed and narrows the graph’s context. `agent/authorization.py` checks that trusted context before collection. `tests/test_auth.py` covers missing credentials, cross-namespace denial, and fail-closed behavior across the five adapters. |
| Agent orchestration | `agent/graph.py` binds the tools to the model. The agent writes an AI message, conditional routing dispatches requested calls to ToolNode, and ToolNode results feed back to the agent. The default graph step limit is 16. `tests/test_agent_workflow.py` exercises the loop across all five tools with a scripted model. `tests/test_backend.py` exercises FastAPI through the real async graph with mocked model and collector behavior. |
| Read-only collection and RBAC | `agent/tools/__init__.py` registers `list_pods`, `get_pod_info`, `get_logs`, `get_events`, and `get_metrics`. `diagnostic_service/tools/` uses namespaced Pod list and get, Pod log get, core Event list, and metrics Pod get. `deploy/aiops/manifests/aiops-agent-rbac.yaml` grants those verbs to the restricted lab identity through a namespaced Role and RoleBinding. `tests/test_kubernetes_credentials.py` and `tests/test_aiops_chart.py` verify the exact permission sets. |
| Evidence format and errors | `diagnostic_service/models.py` defines the combined evidence format. `diagnostic_service/diagnostics.py` combines Pod and container details, bounded current and previous logs, Events, optional per-container metrics, and collection errors. `agent/tools/_common.py` wraps tool evidence in JSON `ToolMessage` objects keyed by tool-call ID and distinguishes partial evidence from collection failure. `backend/evidence/routes.py` provides the separately authenticated direct evidence endpoint. |
| Response and tracing | `backend/investigations/schemas.py` defines the UUID `investigation_id`, `status`, `answer`, and `metadata` fields `duration_ms`, `tools_used`, and `tool_call_count`. `backend/investigations/telemetry.py` derives tool names and counts from structured messages, including failed requested calls, and avoids counting their replies again. `backend/core/logging.py` writes private rotating, redacted operations and message streams. Those streams can be joined by investigation ID, and tool replies can be matched using tool-call IDs. |
| Failure handling and CI | `backend/investigations/routes.py` handles tool namespace denial and graph step limits, preserves prior graph messages when a later step fails, and returns safe error text. `tests/test_backend.py` covers partial history, redaction, cancellation, and safe errors. `.github/workflows/ci.yml` runs offline Python checks, authorization and collector tests, and Helm lint, rendering, and template tests. The local test run is separate from a hosted CI run. |

## Proposed case-study layout

Use the five stages in `evidence.json` as a stepper. Give each stage a plain provenance label and use expandable JSON only where it helps a reader inspect the evidence.

1. **Investigation Request** — show the HTTP method, route, and sample JSON. Label it “Example request.”
2. **Tool Execution** — show the four collectors in the observed orchestration order, with their corresponding agent-tool names as reference. Label it “Live CLI collection.”
3. **Kubernetes Evidence** — lead with the waiting reason and prior exit code, then show the previous logs, the BackOff Event, and the unavailable metrics status.
4. **Agent Interpretation** — label the current text “Human interpretation.” A verified model response can occupy this stage after a hosted-model capture.
5. **Result** — summarize the partial collector result and link to the live integration and offline checks. The nullable API fields are reserved for genuine investigation responses.

For an end-to-end capture, use a configured backend with a scoped test account. Submit the example request, join the response UUID to the private operations and message logs, match each call to its `ToolMessage`, and review an allowlisted subset before publication. Transmitting even the lab’s selected evidence to the configured hosted model requires explicit authorization.
