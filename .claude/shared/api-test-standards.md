# API Test Standards for Trustify UI

This document contains validation rules and code quality standards for Playwright API integration tests (`.ts` files in `e2e/tests/api/features/`).

**Used by:**
- `.claude/agents/api-test-generator.md`
- `.claude/agents/api-test-reviewer.md`
- `.claude/agents/api-coverage-analyzer.md`

---

## 1. Import Order (MANDATORY)

Required order with blank lines between groups:

1. **Fixtures block**: `test` and `expect` from local fixtures
2. **Helpers block**: Shared helper functions from `../helpers/`

### Examples

**Minimal (no helpers needed):**

```typescript
import { expect, test } from "../fixtures";
```

**With helpers:**

```typescript
import { expect, test } from "../fixtures";
import {
  testBasicSort,
  validateDateSorting,
  validateStringSorting,
} from "../helpers/sorting-helpers";
```

**With general helpers (for file uploads, deletions):**

```typescript
import { expect, test } from "../fixtures";
import { uploadFiles, deleteSboms } from "../helpers/general-helpers";
```

### Rules

- **NEVER** import `test` or `expect` from `@playwright/test` directly — always use `"../fixtures"`
- Omit `expect` from the import if only `test` is needed
- Helper imports go in a separate block after fixtures, with a blank line between

---

## 2. Fixture Usage (CRITICAL)

All tests receive an `axios` fixture — a pre-configured `AxiosInstance` with authentication and base URL set up. **Never instantiate axios manually inside tests.**

### ✅ CORRECT

```typescript
test("List advisories", async ({ axios }) => {
  const response = await axios.get("/api/v3/advisory");
  expect(response.status).toBe(200);
});
```

### ❌ WRONG

```typescript
import axios from "axios";  // ❌ Manual instance

test("List advisories", async () => {
  const response = await axios.get("http://localhost:8080/api/v3/advisory");
  // ❌ Hard-coded URL, no auth
});
```

### Test File Location

- **Features**: `e2e/tests/api/features/[domain].ts`
- **Helpers**: `e2e/tests/api/helpers/[name].ts`
- **File extension**: `.ts` (not `.spec.ts`)

---

## 3. Query Parameter Handling (CRITICAL)

**Always use `URLSearchParams`** for query parameters. Trustify queries frequently involve PURLs and CPEs, which contain special characters (`:`, `/`, `@`, `+`, `&`) that must be correctly encoded. Enforcing a single approach eliminates the judgment call about "is this simple enough to skip it?" — that judgment is where encoding bugs occur.

```typescript
test("Filter vulnerabilities by severity", async ({ axios }) => {
  const queryParams = new URLSearchParams();
  queryParams.append("offset", "0");
  queryParams.append("limit", "10");
  queryParams.append("sort", "published:asc");
  queryParams.append("q", "CVE-2023-2&average_severity=medium|high");

  const response = await axios.get("/api/v3/vulnerability", {
    params: queryParams,
  });

  expect(response.status).toBe(200);
});
```

```typescript
test("Sort advisories by ID ascending", async ({ axios }) => {
  const queryParams = new URLSearchParams();
  queryParams.append("offset", "0");
  queryParams.append("limit", "100");
  queryParams.append("sort", "identifier:asc");

  const response = await axios.get("/api/v3/advisory", {
    params: queryParams,
  });

  expect(response.status).toBe(200);
});
```

### ❌ NEVER DO

```typescript
// ❌ Plain object — skips encoding, unsafe for PURLs/CPEs
await axios.get("/api/v3/advisory", { params: { offset: 0, limit: 10 } });

// ❌ Inline URL — no encoding, hard to extend
await axios.get("/api/v3/sbom?limit=10&offset=0");

// ❌ Template string concatenation — unsafe for special chars
await axios.get(`/api/v3/advisory?q=${query}&sort=${sort}`);

// ❌ Manual encodeURIComponent — error-prone
await axios.get(`/api/v3/advisory?q=${encodeURIComponent(query)}`);
```

---

## 4. Assertions (HIGH)

### Status Code Check

Always verify the response status code first:

```typescript
expect(response.status).toBe(200);
```

### Schema Validation

Use `objectContaining` and `arrayContaining` for partial schema checks — do not assert on the exact full response body:

```typescript
// Paginated list response
expect(response.data).toEqual(
  expect.objectContaining({
    total: expect.any(Number),
    items: expect.any(Array),
  }),
);

// Array of items with specific shape
expect(response.data.items).toEqual(
  expect.arrayContaining([
    expect.objectContaining({
      id: expect.any(String),
      identifier: expect.any(String),
    }),
  ]),
);
```

### Deep Object Matching

Use `toMatchObject` only when asserting against a value you captured earlier in the same test — for example, an ID returned from an upload. **Do not hardcode literal values** (PURLs, IDs, names) pulled from the OpenAPI spec or guessed from context; those assertions will fail in environments with different data. This type of assertion is typically done manually. If unsure whether `toMatchObject` is appropriate, ask before using it.

```typescript
// ✅ Value was derived in this test — safe to assert literally
const uploadedId = sbomIds[0];
expect(response.data).toMatchObject({ id: uploadedId });

// ❌ Hardcoded PURL from spec — brittle, environment-dependent
expect(response.data).toMatchObject({
  recommendations: {
    "pkg:maven/io.quarkus.arc/arc-processor@3.20.2": [],
  },
});
```

### Quantity Assertions

```typescript
expect(response.data.total).toBeGreaterThan(0);
expect(response.data.items.length).toBeLessThanOrEqual(10);
expect(response.data.items.length).toBeGreaterThan(0);
```

### ❌ Weak Assertions to Avoid

```typescript
// ❌ Too vague — only checks status, skips body structure
expect(response.status).toBe(200);
// (no further assertions)

// ❌ Too weak — asserts existence but not shape
expect(response.data).toBeDefined();
expect(response.data).not.toBeNull();
```

---

## 5. Error Handling for Negative Tests (HIGH)

Axios throws on non-2xx responses. Use `.catch((err) => err.response)` to capture error responses for assertion:

### ✅ CORRECT — `.catch` pattern (preferred)

```typescript
test("Rejects invalid PURL format", async ({ axios }) => {
  const response = await axios
    .post("/api/v3/purl/recommend", { purls: ["not_a_purl"] })
    .catch((err) => err.response);

  expect(response.status).toBe(400);
});
```

### ❌ TECHNICALLY NOT WRONG, BUT UGLY —  `try/catch`

```typescript
test("Rejects invalid input", async ({ axios }) => {
  try {
    await axios.post("/api/v3/endpoint", { invalid: "data" });
    throw new Error("Should have thrown");
  } catch (error: unknown) {
    const axiosError = error as { response: { status: number } };
    expect(axiosError.response.status).toBe(400);
  }
});
```

### ❌ WRONG — Unhandled rejection

```typescript
// ❌ axios throws, test errors before reaching the expect
const response = await axios.post("/api/v3/endpoint", { bad: "data" });
expect(response.status).toBe(400);
```

---

## 6. Test Structure and File Organization (HIGH)

### Flat Tests vs `describe` Blocks

Both styles are valid. **Match the existing style in the file when adding tests.**

**Flat tests** — use for standalone, independent test cases:

```typescript
test("Recommendations - Empty PURL list", async ({ axios }) => { ... });
test("Recommendations - Single PURL without recommendations", async ({ axios }) => { ... });
```

**`describe` blocks** — use for grouping related tests or sharing setup data:

```typescript
test.describe("Recommendation API - Invalid PURL Format", () => {
  const invalidPurls = ["not_a_purl", "pkg:/missing-type"];

  for (const badPurl of invalidPurls) {
    test(`rejects invalid PURL: "${badPurl}"`, async ({ axios }) => { ... });
  }
});
```

**When adding to an existing file:**
- If the file uses flat tests → add flat tests
- If the file uses `describe` → add to an existing `describe` or create a new one
- **Never restructure existing code** (no adding `describe` where none exists, no removing them)

### `test.skip` for Data-Dependent Tests

Use `test.skip` to document test cases that require specific data not available in all environments. Add a comment explaining why:

```typescript
// Skipped: requires specific test dataset loaded in the environment
test.skip("Filter vulnerabilities by severity - vanilla", async ({ axios }) => {
  // ...
});
```

### Shared Constants in `describe`

It is acceptable to share constants within a `describe` block scope:

```typescript
test.describe("Advisory API", () => {
  const endpoint = "/api/v3/advisory";

  test("list advisories", async ({ axios }) => {
    const response = await axios.get(endpoint);
    // ...
  });
});
```

---

## 7. Code Reusability (HIGH)

### Use Existing Helpers

Before writing logic inline, check the existing helper files in the `e2e/tests/api/helpers` folder. For example:

- **`e2e/tests/api/helpers/sorting-helpers.ts`**: `testBasicSort`, `validateDateSorting`, `validateStringSorting`, `validateNumericSorting`, `validateSortDirectionDiffers`
- **`e2e/tests/api/helpers/general-helpers.ts`**: `uploadFiles`, `deleteSboms`, `getFullSbomPaths`


```typescript
import { testBasicSort, validateStringSorting } from "../helpers/sorting-helpers";

test("Sort advisories by ID ascending", async ({ axios }) => {
  const items = await testBasicSort(axios, "/api/v3/advisory", "identifier", "asc");
  validateStringSorting(items, "identifier", "ascending");
});
```

### Flag Duplication

If new tests contain helper functions or repeated logic that already exists (or could be extracted), flag it:

- Minor duplication (2–3 lines): **MEDIUM**
- Duplication across many files: **CRITICAL** (extract to `e2e/tests/api/helpers/`)

### File Upload Tests

Use `uploadFiles` from `general-helpers.ts` — never read files manually:

```typescript
import { uploadFiles, deleteSboms } from "../helpers/general-helpers";

test.describe("SBOM upload", () => {
  let sbomIds: string[] = [];

  test.afterEach(async ({ axios }) => {
    await deleteSboms(axios, sbomIds);
    sbomIds = [];
  });

  test("Upload SBOM", async ({ axios }) => {
    sbomIds = await uploadFiles(axios, "sbom", ["path/to/sbom.json"]);
    expect(sbomIds.length).toBe(1);
  });
});
```

Tests using file uploads and deletes should be run sequentially.

---

## 8. Code Quality (MEDIUM)

### TypeScript

- Avoid `any` — when unavoidable (e.g., generic helpers working with unknown API response shapes), suppress with an inline comment:
  ```typescript
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- API response types are not strictly typed in tests
  (item: any) => item.identifier
  ```
- Use proper types for parameters and return values
- No unused imports or variables

### Naming

- Clear, descriptive test names: describe the domain, action, and expected outcome
- Descriptive variable names: `response`, `items`, `queryParams` — not `r`, `d`, `qp`

### Async/Await

- Always `await` axios calls
- No floating promises

### No Hard-Coded Waits

```typescript
// ❌ Never
await page.waitForTimeout(3000);
```

API tests do not use Playwright's browser-level waits. If a response is slow, investigate the root cause rather than adding a delay.

---

## 9. Bugfix / Regression Tests (MEDIUM)

Tests written to cover a specific bug fix must include a structured comment and reference the Jira ticket in the test name.

### Required Format

```typescript
// Jira: TRUSTIFY-1234
// Bug: GET /api/v3/advisory returned 500 when q contained special character &
// Fix: Wrap q parameter in URLSearchParams to properly encode special characters
test("TRUSTIFY-1234: Query with special characters returns valid response", async ({ axios }) => {
  const queryParams = new URLSearchParams();
  queryParams.append("q", "title=foo&bar");

  const response = await axios.get("/api/v3/advisory", { params: queryParams });

  expect(response.status).not.toBe(500);
  expect([200, 400]).toContain(response.status);
});
```

### Rules

- If no Jira ID is available, ask for one before generating the test
- All three comment lines (`// Jira:`, `// Bug:`, `// Fix:`) are required
- The Jira ID must appear in both the comment and the test name

---

## 10. Test Independence (MEDIUM)

Each test must be self-contained and runnable in any order.

### ✅ GOOD — Self-contained tests

```typescript
const sharedId: string;  

test("Test A", async ({ axios }) => {
  // All setup done inline
  await axios.get(`/api/v3/sbom/${sharedId}`);
});

test("Test B", async ({ axios }) => {
  // All setup done inline, no dependency on Test A
  await axios.get(`/api/v3/sbom/${sharedId}`);
});
```

### ❌ BAD — Shared mutable state

```typescript
let sharedId: string;  // ❌ Module-level mutable state

test("Create resource", async ({ axios }) => {
  const response = await axios.post("/api/v3/sbom", ...);
  sharedId = response.data.id;  // ❌ Side effect
});

test("Get resource", async ({ axios }) => {
  await axios.get(`/api/v3/sbom/${sharedId}`);  // ❌ Depends on previous test
});
```

**Exception**: When a `describe`-scoped variable tracks created resources for cleanup in `afterEach`, that is acceptable because the lifecycle is controlled:

```typescript
test.describe("Upload flow", () => {
  let createdIds: string[] = [];

  test.afterEach(async ({ axios }) => {
    await deleteSboms(axios, createdIds);
    createdIds = [];
  });

  test("upload and verify", async ({ axios }) => {
    createdIds = await uploadFiles(axios, "sbom", [...]);
    // ...
  });
});
```

---

## 11. Severity Levels for Issues

### CRITICAL (Must fix)

- Importing `test` or `expect` from `@playwright/test` instead of `"../fixtures"`
- Manually instantiating axios instead of using the fixture
- Unhandled axios rejection in a negative test (no `.catch` or `try/catch`)
- Duplicate helper functions that already exist in `e2e/tests/api/helpers/`
- Module-level mutable state shared between tests

### HIGH (Should fix)

- Wrong import order (helpers before fixtures)
- Query params not using `URLSearchParams` (plain object, inline URL, template strings, or manual `encodeURIComponent`)
- Missing assertions on `response.data` structure (only checking status code)
- Weak assertions (`toBeDefined`, `not.toBeNull`) when schema validation is possible
- Helper functions duplicated across feature files
- Modifying existing tests when asked to add new ones
- `any` type without a suppression comment explaining why

### MEDIUM (Nice to fix)

- Unclear variable names (`r`, `d`)
- Missing `test.skip` comment explaining why the test is skipped
- Bugfix test missing Jira comment structure
- Dependent tests without `afterEach` cleanup

### LOW (Optional)

- Minor formatting inconsistencies caught by the linter
- Test description could be more specific
- `describe` block title could better reflect its contents

---

## 12. Quick Reference Checklist

Use this checklist when generating or reviewing API tests:

- [ ] **Import order**: Fixtures first (`"../fixtures"`), then helpers — blank line between groups
- [ ] **Fixture usage**: `{ axios }` from fixture, never manual axios instantiation
- [ ] **Query params**: Always `URLSearchParams` — no plain objects, inline URLs, or template strings
- [ ] **Status assertion**: `expect(response.status).toBe(...)` present
- [ ] **Body assertion**: `objectContaining` or `toMatchObject` — not just `toBeDefined`
- [ ] **Negative tests**: `.catch((err) => err.response)` pattern used
- [ ] **Helpers reused**: Checked `sorting-helpers.ts` and `general-helpers.ts` before writing inline logic
- [ ] **No duplication**: No helper functions already defined in other feature files
- [ ] **File structure preserved**: Flat vs `describe` style matches existing file
- [ ] **TypeScript**: No `any` without suppression comment; no unused imports
- [ ] **Test independence**: No module-level mutable state (except `afterEach`-cleaned describe scope)
- [ ] **Bugfix format**: Jira ID in comment block and test name (if applicable)
- [ ] **Linter passes**: `npm run check -w e2e`

---

## Additional Resources

- **Fixtures**: `e2e/tests/api/fixtures.ts` — axios instance, auth setup
- **Sorting Helpers**: `e2e/tests/api/helpers/sorting-helpers.ts`
- **General Helpers**: `e2e/tests/api/helpers/general-helpers.ts`
- **Feature Tests**: `e2e/tests/api/features/`
- **OpenAPI Spec**: `client/openapi/trustd.yaml`
- **Test Architecture**: See `AGENTS.md` for full project context

---

**Last Updated**: 2026-06-24
**Version**: 1.1.0
