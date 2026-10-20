---
description: Create API test in e2e/tests/api
argument-hint: Endpoint or test description (e.g. "GET /api/v3/advisory" or "advisory sorting")
---

## Context

Parse $ARGUMENTS to get the following values:

- [scope]: Endpoint path, method, or test description from $ARGUMENTS

## Task

Generate Playwright API integration tests for [scope] by invoking the **api-test-orchestrator** subagent.

The orchestrator will:
1. Parse the OpenAPI spec (`client/openapi/trustd.yaml`) for endpoint details
2. Generate test code following the [API Test Standards](../shared/api-test-standards.md)
3. Run the linter and review for quality
4. Iterate up to 3 times until the test passes review

Tests are written under `e2e/tests/api/features/`.
