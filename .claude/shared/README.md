# Shared E2E Test Resources

This directory contains shared resources used by both Claude Code agents (`.claude/agents/`) and GitHub chatmodes (`.github/chatmodes/`).

## Purpose

Centralize validation rules, code quality standards, and testing patterns to maintain consistency across all E2E test generation and review workflows.

## Files

### `api-test-standards.md`

Core validation rules and code quality standards for Playwright API integration tests (`.ts` files in `e2e/tests/api/features/`).

**Used by:**
- `.claude/agents/api-test-generator.md` — API test generator
- `.claude/agents/api-test-reviewer.md` — API test reviewer
- `.claude/agents/api-coverage-analyzer.md` — Coverage analysis

**Contents:**
1. Import Order (MANDATORY)
2. Fixture Usage (CRITICAL) — axios fixture, file location
3. Query Parameter Handling (CRITICAL) — URLSearchParams vs plain object
4. Assertions (HIGH) — objectContaining, toMatchObject, quantity checks
5. Error Handling for Negative Tests (HIGH) — `.catch((err) => err.response)`
6. Test Structure and File Organization (HIGH) — flat vs describe, test.skip
7. Code Reusability (HIGH) — existing helpers, duplication severity
8. Code Quality (MEDIUM) — TypeScript, naming, no hard-coded waits
9. Bugfix / Regression Tests (MEDIUM) — Jira comment format
10. Test Independence (MEDIUM) — mutable state rules
11. Severity Levels for Issues
12. Quick Reference Checklist

**Cross-references:** Independent of UI test standards — API tests do not use page objects or custom UI assertions.

---

### `playwright-standards.md`

Core Playwright validation rules and code quality standards for vanilla Playwright tests (`.spec.ts`, `.test.ts`).

**Used by:**
- `.claude/agents/playwright-test-reviewer.md` - Vanilla Playwright test reviewer
- `.claude/agents/bdd-test-reviewer.md` - Invokes playwright-test-reviewer for step definitions
- `.github/chatmodes/playwright-tester.chatmode.md` - Test generator chatmode

**Contents:**
1. Import Order for Vanilla Tests (MANDATORY)
2. Page Object Construction Patterns (CRITICAL)
3. Custom Assertions Usage (CRITICAL)
4. Code Quality Standards
5. Wait Strategies
6. Test Structure and Best Practices
7. Severity Levels for Issues
8. Quick Reference Checklist

**Cross-references:** See [bdd-standards.md](./bdd-standards.md) for BDD-specific standards.

---

### `bdd-standards.md`

BDD-specific validation rules for playwright-bdd tests (`.step.ts`) and Gherkin feature files (`.feature`).

**Used by:**
- `.claude/agents/bdd-test-reviewer.md` - BDD test and feature file reviewer
- `.claude/agents/bdd-test-generator.md` - BDD test generator
- `.github/chatmodes/playwright-tester.chatmode.md` - Test generator chatmode

**Contents:**
1. Import Order for BDD Step Definitions (MANDATORY)
2. playwright-bdd Pattern (MANDATORY)
3. Step Quality Guidelines
4. No Duplicate Step Definitions (CRITICAL)
5. Data Tables and Scenario Outlines
6. Gherkin Standards (NEW)
   - Feature file structure
   - Declarative vs Imperative scenarios
   - Scenario vs Scenario Outline
   - Background vs Before Each
   - Tag usage
   - Anti-patterns
   - Best practices
7. Severity Levels for Issues
8. Quick Reference Checklist
9. Integration with Core Playwright Standards

**Cross-references:** See [playwright-standards.md](./playwright-standards.md) for core Playwright standards.

---

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Test Review Architecture                 │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Vanilla Playwright Tests (.spec.ts)                        │
│       ↓                                                      │
│  playwright-test-reviewer                                   │
│       ↓                                                      │
│  Uses: playwright-standards.md                              │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  BDD Step Definitions (.step.ts)                            │
│       ↓                                                      │
│  bdd-test-reviewer                                          │
│       ↓                                                      │
│  1. Invokes: playwright-test-reviewer (core checks)         │
│  2. Applies: bdd-standards.md (BDD-specific checks)         │
│  3. Combines verdicts                                       │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Feature Files (.feature)                                   │
│       ↓                                                      │
│  bdd-test-reviewer                                          │
│       ↓                                                      │
│  Uses: bdd-standards.md (Gherkin checks only)               │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  API Integration Tests (.ts in api/features/)               │
│       ↓                                                      │
│  api-test-reviewer / api-test-generator                     │
│       ↓                                                      │
│  Uses: api-test-standards.md                                │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## How to Reference

### From `.claude/agents/` files

Use relative path with one level up:

```markdown
# For API Test Standards
See [API Test Standards](../shared/api-test-standards.md) for API integration test standards.

Specific sections:
- [Import Order](../shared/api-test-standards.md#1-import-order-mandatory)
- [Fixture Usage](../shared/api-test-standards.md#2-fixture-usage-critical)
- [Query Parameters](../shared/api-test-standards.md#3-query-parameter-handling-critical)
- [Assertions](../shared/api-test-standards.md#4-assertions-high)
- [Error Handling](../shared/api-test-standards.md#5-error-handling-for-negative-tests-high)

# For Playwright Standards
See [Playwright Standards](../shared/playwright-standards.md) for core test standards.

Specific sections:
- [Import Order](../shared/playwright-standards.md#1-import-order-mandatory)
- [Page Objects](../shared/playwright-standards.md#2-page-object-construction-critical)
- [Custom Assertions](../shared/playwright-standards.md#3-custom-assertions-critical)
- [Code Quality](../shared/playwright-standards.md#4-code-quality-standards)
- [Wait Strategies](../shared/playwright-standards.md#5-wait-strategies)

# For BDD Standards
See [BDD Standards](../shared/bdd-standards.md) for playwright-bdd and Gherkin standards.

Specific sections:
- [BDD Import Order](../shared/bdd-standards.md#1-import-order-for-bdd-step-definitions-mandatory)
- [playwright-bdd Pattern](../shared/bdd-standards.md#2-playwright-bdd-pattern-mandatory)
- [Step Quality](../shared/bdd-standards.md#3-step-quality)
- [No Duplicates](../shared/bdd-standards.md#4-no-duplicate-step-definitions-critical)
- [Gherkin Standards](../shared/bdd-standards.md#6-gherkin-standards)
```

### From `.github/chatmodes/` files

Use relative path with two levels up:

```markdown
# For API Test Standards
See [API Test Standards](../../.claude/shared/api-test-standards.md) for API integration test standards.

Specific sections:
- [Import Order](../../.claude/shared/api-test-standards.md#1-import-order-mandatory)
- [Fixture Usage](../../.claude/shared/api-test-standards.md#2-fixture-usage-critical)
- [Query Parameters](../../.claude/shared/api-test-standards.md#3-query-parameter-handling-critical)

# For Playwright Standards
See [Playwright Standards](../../.claude/shared/playwright-standards.md) for core test standards.

Specific sections:
- [Import Order](../../.claude/shared/playwright-standards.md#1-import-order-mandatory)
- [Page Objects](../../.claude/shared/playwright-standards.md#2-page-object-construction-critical)

# For BDD Standards
See [BDD Standards](../../.claude/shared/bdd-standards.md) for playwright-bdd and Gherkin standards.

Specific sections:
- [BDD Import Order](../../.claude/shared/bdd-standards.md#1-import-order-for-bdd-step-definitions-mandatory)
- [playwright-bdd Pattern](../../.claude/shared/bdd-standards.md#2-playwright-bdd-pattern-mandatory)
- [Gherkin Standards](../../.claude/shared/bdd-standards.md#6-gherkin-standards)
```

## Benefits

✅ **Separation of Concerns**: Playwright and BDD standards separated for clarity
✅ **Modular Architecture**: Reviewers can invoke each other (BDD → Playwright)
✅ **Single Source of Truth**: Standards defined once, referenced everywhere
✅ **Consistency**: All agents and chatmodes follow identical rules
✅ **Easy Maintenance**: Update standards in focused files
✅ **Version Control**: Clear history of standard changes
✅ **Discoverability**: Developers can read standards directly
✅ **Extensibility**: Easy to add more shared resources and reviewers

## Maintenance

When updating standards:

### For API Test Standards
1. Edit `api-test-standards.md` directly
2. Changes automatically apply to:
   - `api-test-generator`
   - `api-test-reviewer`
   - `api-coverage-analyzer`
3. Commit changes with clear description
4. Update version number at bottom of file

### For Core Playwright Standards
1. Edit `playwright-standards.md` directly
2. Changes automatically apply to:
   - `playwright-test-reviewer` (directly)
   - `bdd-test-reviewer` (via playwright-test-reviewer invocation)
3. Commit changes with clear description
4. Update version number at bottom of file

### For BDD Standards
1. Edit `bdd-standards.md` directly
2. Changes automatically apply to:
   - `bdd-test-reviewer`
   - `bdd-test-generator`
3. Commit changes with clear description
4. Update version number at bottom of file

### Architecture Changes
If modifying how reviewers interact:
1. Update agent files in `.claude/agents/`
2. Update architecture diagram in this README
3. Test reviewer invocation flow
4. Update chatmode files if needed

## Migration Notes

**v2.0.0 (2026-01-21)**: Split single `e2e-test-standards.md` into:
- `playwright-standards.md` - Core Playwright standards
- `bdd-standards.md` - BDD and Gherkin standards

**Old file**: `e2e-test-standards.md` (archived as `.old`)

**Reason**: Separate concerns, enable modular 2-agent reviewer architecture

## Future Additions

Potential shared resources to add:

- `page-object-patterns.md` - Page Object Model patterns and examples
- `custom-assertion-guide.md` - Guide for creating custom assertions
- `test-data-fixtures.md` - Test data management patterns
- `common-scenarios.md` - Reusable scenario patterns
- `accessibility-test-standards.md` - Accessibility testing standards

---

**Last Updated**: 2026-06-17
**Maintained by**: Trustify UI team
