---
description: Analyze API test coverage against the OpenAPI spec
argument-hint: Optional focus (e.g. "advisory" or "GET /api/v3/sbom" — omit for full report)
---

## Context

Parse $ARGUMENTS to get the following values:

- [focus]: Optional endpoint, domain, or mode from $ARGUMENTS (empty = `summary`)

## Pre-processing

Run both commands and capture their output before invoking the agent.

**[spec_summary]** — compact endpoint inventory from OpenAPI spec:
```bash
yq '.paths | to_entries | .[] | .key as $path | .value | to_entries | .[] | .key + " " + $path + " [" + (.value.operationId // "?") + "]\n  params: " + (.value.parameters // [] | map(.name + "(" + .in + ")") | join(" ")) + "\n  responses: " + (.value.responses | keys | join(" "))' client/openapi/trustd.yaml
```

**[test_coverage_map]** — which endpoints have tests and how many:
```bash
grep -rh '/api/v' e2e/tests/api/features/*.ts | grep -oE '"(/api/v[^"?]+)|`(/api/v[^`?$]+)' | tr -d '"' | sed 's/`//' | sed 's/\${[^}]*}/{id}/' | sort | uniq -c | sort -rn
```

**[test_file_map]** — which test files cover each endpoint (for targeted deep dives):
```bash
for f in e2e/tests/api/features/*.ts; do
  name=$(basename $f .ts)
  grep -oE '"/api/v[^"?]+|`/api/v[^`?$]+' "$f" | tr -d '"' | sed 's/`//' | sed 's/\${[^}]*}/{id}/g' | sort -u | while read ep; do
    echo "$name → $ep"
  done
done | sort -u
```

## Task

Invoke the **api-coverage-analyzer** subagent with [focus], [spec_summary], and [test_coverage_map].

The agent must NOT re-read `client/openapi/trustd.yaml` or any test files unless doing a deep dive on a specific endpoint.

Supported modes:
- **No argument** — summary (metrics + top priorities)
- **Domain name** (e.g. `advisory`) — analysis scoped to that domain
- **Endpoint** (e.g. `GET /api/v3/advisory`) — deep dive on a single endpoint (agent reads that endpoint's `.ts` file)
- **`summary`** — metrics and top priorities only (no file reads needed)
- **`gaps`** — prioritized list of untested endpoints (no file reads needed)
