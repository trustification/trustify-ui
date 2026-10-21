# Coding Conventions

## Language and Framework

- TypeScript 6.0, React 19
- UI component library: PatternFly 6 (`@patternfly/react-core`, `@patternfly/react-table`)
- Build tool: Vite (client), Rollup (common, server)
- Routing: react-router-dom v7 with lazy-loaded routes
- Data fetching: TanStack React Query v5
- API client: auto-generated from OpenAPI spec via `@hey-api/openapi-ts` with Axios
- Forms: react-hook-form + yup validation
- E2E testing: Playwright with playwright-bdd (Gherkin features)
- Unit testing: Vitest
- Linting/formatting: ESLint + Prettier
- Package manager: npm workspaces (Node.js >= 24)

## Code Style

- Formatter: Prettier with space indentation (2 spaces), double quotes
- Line length: 80 characters (`.editorconfig`)
- Line endings: LF
- Run `npm run lint` before committing
- Run `npm run format:fix` to auto-format
- Organize imports: disabled in ESLint config (manual ordering)
- **Import Order**: Group imports alphabetically and follow the order below,
  with each block separated by a blank line:
  1. **React/Router block**: Dependencies from `react`, `react-dom`,
     `react-router`, `react-router-dom`, `react-oidc-context`,
     `react-hook-form`, etc.
  2. **Package dependencies block**: Any dependency declared in
     `package.json` (e.g., `axios`, `dayjs`, `yup`, `lodash`, etc.)
  3. **PatternFly block**: Any `@patternfly/*` dependency
  4. **App imports block**: Any `@app/*` dependency
  5. **Relative imports block**: Local relative imports (`./`, `../`, etc.)

**Example:**

```ts
import React from "react";
import {Link, useNavigate} from "react-router-dom";

import type {AxiosError} from "axios";
import dayjs from "dayjs";
import arraySupport from "dayjs/plugin/arraySupport";

import {
  Breadcrumb,
  Tab,
} from "@patternfly/react-core";

import {PathParam, Paths, useRouteParams} from "@app/Routes";
import {LoadingWrapper} from "@app/components/LoadingWrapper";

import {Overview} from "./overview";
```

- The `client/src/app/client/` directory is auto-generated — never edit directly; regenerate with `npm run generate -w client`
- CSS modules enabled for `.module.css` files

## Naming Conventions

- React components: PascalCase (`SbomList`, `SbomTable`, `SbomToolbar`, `ErrorFallback`)
- Component files: kebab-case for page files (`sbom-list.tsx`, `sbom-table.tsx`, `sbom-context.tsx`), PascalCase for reusable components (`SBOMEditLabelsForm.tsx`, `SbomVulnerabilities.tsx`)
- Custom hooks: camelCase with `use` prefix (`useFetchSBOMs`, `useDeleteSbomMutation`, `useUpload`)
- Query key constants: PascalCase with `QueryKey` suffix (`SBOMsQueryKey`, `AdvisoriesQueryKey`, `VulnerabilitiesQueryKey`)
- Query hooks: `useFetch<Resource>` for reads, `use<Action><Resource>Mutation` for writes
- Context providers: `<Domain>SearchProvider` wrapping a `<Domain>SearchContext`
- Page directories: kebab-case matching the domain (`sbom-list/`, `advisory-details/`, `vulnerability-list/`)
- Route paths: kebab-case (`/sboms`, `/advisories`, `/vulnerabilities`)
- Path alias: `@app/` maps to `client/src/app/`
- E2E page objects: PascalCase classes (`SbomListPage`, `AdvisoryListPage`)

## File Organization

### Monorepo structure

```
package.json            # workspace root
common/                 # shared ESM module (branding, environment config)
client/                 # React SPA
server/                 # Express.js production server (proxying, env injection)
e2e/                    # Playwright end-to-end tests
eslint.config.mjs       # ESLint config
.prettierrc.mjs         # Prettier config
```

### Client structure (`client/src/app/`)

```
Routes.tsx              # route definitions with lazy() imports
Constants.ts            # app-wide constants
env.ts                  # environment config
oidc.ts                 # OIDC auth config
dayjs.ts                # dayjs setup

pages/                  # page components, one directory per page
  <domain>-list/        # list page for a domain
    index.ts            # re-export: `export { DomainList as default } from "./domain-list"`
    <domain>-list.tsx   # main page component
    <domain>-table.tsx  # table component
    <domain>-toolbar.tsx # toolbar with filters/actions
    <domain>-context.ts  # React context definition and interface
    <domain>-provider.tsx # context provider with table state, data fetching
    helpers.ts          # page-specific helpers
    components/         # page-specific sub-components

  <domain>-details/     # detail page for a domain
    <domain>-details.tsx
    overview.tsx
    <sub-tab>.tsx       # tab content components
    components/         # detail-specific sub-components
    index.ts

queries/                # TanStack Query hooks, one file per domain
  sboms.ts              # useFetchSBOMs, useDeleteSbomMutation, etc.
  advisories.ts
  vulnerabilities.ts
  packages.ts
  ...

components/             # shared UI components
  FilterToolbar/        # complex components get their own directory
  SimplePagination/
  ConfirmDialog.tsx     # simple components are single files
  ...

hooks/                  # custom hooks
  table-controls/       # table state management (pagination, sorting, filtering)
  domain-controls/      # domain-specific data hooks
  useUpload.ts
  useUrlParams.ts
  ...

api/                    # custom REST calls (uploads, downloads)
  rest.ts

client/                 # auto-generated API client (DO NOT EDIT)
axios-config/           # Axios instance and interceptors
  apiInit.ts
```

### E2E test structure (`e2e/tests/`)

```
ui/
  features/             # BDD .feature files (Gherkin)
    @<domain>/          # feature + step definitions grouped by domain
  pages/                # Page Object Model classes
    <domain>-list/
      <Domain>ListPage.ts   # page object class
      columns.spec.ts       # spec per concern
      filter.spec.ts
      sort.spec.ts
      pagination.spec.ts
      actions.spec.ts
    <domain>-details/
      <Domain>DetailsPage.ts
      ...
  helpers/              # shared test utilities
  steps/                # shared step definitions
  fixtures.ts           # test fixtures

api/                    # API-level tests
  features/             # API test files
  dependencies/         # setup (global.setup.ts)

common/                 # shared test assets
  dataset/sbom/              # test SBOM files
  dataset/advisory/csaf/     # test CSAF advisory files
  dataset/advisory/csaf_security/  # test CSAF security files
  constants.ts
```

## Error Handling

- API errors are typed as `AxiosError` and propagated through query hooks via `fetchError` return values
- Mutation hooks accept `onSuccess` and `onError` callbacks, handling query invalidation internally
- Top-level error boundary via `react-error-boundary` with `ErrorFallback` component
- Query hooks return a normalized shape: `{ result: { data, total, params }, isFetching, fetchError, refetch }`
- Components display errors using `StateError` component for failed data fetches
- `StateNoData` and `StateNoResults` for empty states

## API Client Pipeline

API types and SDK functions are auto-generated from the OpenAPI spec
(`client/openapi/trustd.yaml`) using `@hey-api/openapi-ts` with Axios. The
generated output at `client/src/app/client/` must never be edited manually.

### Generated vs. manual types

| Layer | Location | Examples | Ownership |
|---|---|---|---|
| Generated | `client/types.gen.ts`, `sdk.gen.ts` | `PaginatedResultsAdvisorySummary`, `ListAdvisoriesData` | Auto-generated — never edit |
| Manual (request) | `api/models.ts` | `HubRequestParams`, `HubFilter` | Hand-maintained |
| Manual (response) | `api/models.ts`, `api/rest.ts` | `HubPaginatedResult<T>`, `PaginatedResponse<T>` | Hand-maintained |

Query hooks in `queries/` bridge the two layers: they call generated SDK
functions and normalize responses into the `HubPaginatedResult<T>` shape.

### Regenerating the client

Update `client/openapi/trustd.yaml` with the new backend spec, then run
`npm run generate -w client`. Follow the full
[Adapting to upstream API changes](#adapting-to-upstream-api-changes) checklist
to reconcile generated types, query hooks, manual types, and constants.

### Legacy REST helpers

- `getHubPaginatedResult` in `api/rest.ts` and `serializeRequestParamsForHub` in `hooks/table-controls/getHubRequestParams.ts` are the legacy serialization path (URLSearchParams). They do **not** serialize the `total` query parameter.
- Only used for upload/download flows — all paginated list queries use `requestParamsQuery` (plain object, includes `total`).
- New paginated endpoints must use the `requestParamsQuery` path.

## Server-Side Pagination

All list pages use server-side pagination. The frontend requests one page at a
time from the backend and displays the server-reported total in the PatternFly
`Pagination` component.

### Request flow

```
Context provider (e.g., pages/advisory-list/advisory-provider.tsx)
  └─ useTableControlState() → { pageNumber (1-indexed), itemsPerPage }
  └─ getHubRequestParams(tableControlState) → HubRequestParams { page, sort, filters }
  └─ Spread extra params: { ...hubRequestParams, total: true }
                                                  ^^^^^^^^^^^^
                                                  MUST be added per-page
  ↓
Query hook (e.g., queries/advisories.ts → useFetchAdvisories)
  └─ requestParamsQuery(params)
     → { offset: (pageNumber-1)*itemsPerPage, limit: itemsPerPage, q, sort, total }
  └─ Generated SDK function (e.g., listAdvisories({ client, query: {...} }))
  ↓
GET /api/v2/advisory?offset=0&limit=10&sort=modified:desc&total=true
```

**Key rule**: `getHubRequestParams` does **not** include `total`. Each context
provider must explicitly add `total: true` onto the params object. Omitting it
means the server skips the COUNT query and returns `total: null`.

### Response flow

```
HTTP response: { items: T[], total: number | null }
  ↓
Query hook normalizes (e.g., queries/advisories.ts):
  data:  data?.data?.items || []
  total: data?.data?.total ?? 0          ← standard nullable guard
  → returns { result: { data, total, params }, isFetching, fetchError, refetch }
  ↓
Context provider destructures:
  { data: advisories, total: totalItemCount } = result
  → passes totalItemCount to useTableControlProps(...)
  ↓
useTableControlProps → usePaginationPropHelpers
  → paginationProps: { itemCount: totalItemCount, perPage, page, onSetPage, ... }
  ↓
<SimplePagination paginationProps={paginationProps} />
  → renders PatternFly <Pagination>
```

**Key rule**: the `?? 0` fallback in query hooks is the standard pattern for
nullable `total`. If the backend makes a field nullable, add a `??` guard in
the query hook — do not change the manual types to optional.

### Pagination constants

- `MAX_ITEMS_PER_PAGE = 1000` in `Constants.ts` — mirrors the server's default max pagination limit (`TRUSTD_PAGINATION_MAX_LIMIT`). Update when the server default changes.
- Default `itemsPerPage` is `10` (from `usePaginationState`).
- `pageNumber` is 1-indexed. Conversion to 0-indexed `offset` happens in `requestParamsQuery`: `offset = (pageNumber - 1) * itemsPerPage`.

### Axios interceptors

Interceptors are registered in `axios-config/apiInit.ts`:

Request interceptor:
- Bearer token injection — attaches the OIDC access token to outgoing requests

Response interceptors:
- Read-only detection (503) — invalidates trustify info cache
- Auth token refresh (401) — silent re-auth with one retry

No centralized 400 handler exists — errors propagate via `fetchError` in query
hooks. To add centralized handling for a new HTTP error code, add a response
interceptor in `initInterceptors()`.

### Adapting to upstream API changes

When the backend OpenAPI spec changes:

1. Update `client/openapi/trustd.yaml` with the new spec
2. Regenerate: `npm run generate -w client`
3. Check generated types for changed shapes (nullable fields, new params)
4. Update query hooks (`queries/`) — add `?? defaultValue` for nullable fields
5. Update context providers (`pages/`) if new request params need passing (e.g., a new opt-in flag like `total: true`)
6. Update `Constants.ts` if server limits changed
7. Add interceptor in `apiInit.ts` if new error codes need centralized handling
8. Update manual types in `api/models.ts` and `api/rest.ts` if needed
9. Run `npm run lint` and verify the build

## Testing Conventions

### Unit tests (Vitest)

- Run with `npm run test` (from root or `client` workspace)
- Config in `client/vite.config.ts` (test block)
- CI runs: `npm run test -- --coverage`

### E2E tests (Playwright)

- Two test styles coexist:
  1. **BDD features**: `.feature` files in `e2e/tests/ui/features/` with step definitions in `.step.ts` files
  2. **Spec files**: `.spec.ts` files in `e2e/tests/ui/pages/<domain>/` organized by concern (columns, filter, sort, pagination, actions)
- Page Object Model pattern: each page has a class (e.g., `SbomListPage`) with a static `build()` factory, encapsulating navigation and element access
- Shared page objects: `Table`, `Toolbar`, `Pagination`, `Navigation` in `e2e/tests/ui/pages/`
- Tags for test tiers: `{ tag: "@tier1" }`
- **No explicit timeouts in shared page objects:** Playwright provides automatic waiting for elements, assertions, and actions. Shared classes (`Table`, `Toolbar`, `Pagination`, `Navigation`) must not add explicit `timeout` parameters. If a component triggers async re-rendering, the wait belongs in that component's page object, not in shared infrastructure.
- **Composition over conditional expansion:** Page object methods should do one thing. For example, `clearAllFilters()` clears filters — checking whether filters exist is the caller's responsibility. Do not add conditional guards inside action methods.
- Run e2e: `npm run e2e:test:ui` (full), `npm run e2e:test:api` (API only)

## Commit Messages

- Follow Conventional Commits: `<type>[optional scope]: <description>`
- Types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`
- Reference the Jira issue in the commit footer (e.g., `Implements TC-123`)
- AI-assisted commits include `--trailer="Assisted-by: Claude Code"`

## Dependencies

- All workspaces managed via npm workspaces in root `package.json`
- Use caret ranges (`^`) for dependencies in `client/package.json`
- Key dependencies: `react` 19, `@patternfly/react-core` 6, `@tanstack/react-query` 5, `axios`, `react-router-dom` 7, `react-hook-form`, `yup`
- API client generated from `client/openapi/trustd.yaml` — update the spec, then `npm run generate -w client`
- Dependabot configured for automated dependency updates

## Page Patterns

### List pages

Each list page follows a consistent architecture:

1. **Context definition** (`<domain>-context.ts`): creates the `<Domain>SearchContext` with `React.createContext()` and defines the context interface
2. **Context provider** (`<domain>-provider.tsx`): manages table state via `useTableControlState`, fetches data with the domain query hook, and provides values through `<Context.Provider>`
3. **Page component** (`<domain>-list.tsx`): renders `PageSection` with title, wraps content in the context provider, renders toolbar and table
4. **Toolbar** (`<domain>-toolbar.tsx`): consumes context for pagination and filter props
5. **Table** (`<domain>-table.tsx`): consumes context for data, columns, sorting, and row rendering

### Detail pages

- Main component fetches by ID from route params
- Content organized into tabs (overview, packages, vulnerabilities, etc.)
- Sub-components for each tab content area

#### Layout structure

Detail pages use a sequence of PatternFly `PageSection` blocks:

```
<PageSection type="breadcrumb">  — breadcrumb navigation
<PageSection>                    — page header (title, actions)
<PageSection>                    — tab bar (Tabs)
<PageSection>                    — tab content panels (TabContent)
```

#### Tab content components

Components rendered inside `<TabContent>` **must not** include their own
`<PageSection>` wrapper. The parent detail page provides the `PageSection` that
wraps all tab content panels.

Canonical example — `client/src/app/pages/sbom-details/sbom-details.tsx`:

```tsx
{/* Parent provides the PageSection */}
<PageSection>
  <TabContent {...getTabContentProps("info")}>
    {sbom && <Overview sbom={sbom} />}       {/* no PageSection inside */}
  </TabContent>
  <TabContent {...getTabContentProps("packages")}>
    {sbomId && <PackagesBySbom sbomId={sbomId} />}
  </TabContent>
</PageSection>
```

This keeps spacing and background styling consistent across all tabs and avoids
double-nesting `PageSection` elements.

### Query hooks

- One file per domain in `queries/`
- Export a query key constant (e.g., `export const SBOMsQueryKey = "sboms"`)
- Fetch hooks use `useQuery` with the shared `client` Axios instance
- Mutation hooks use `useMutation` with `queryClient.invalidateQueries` on success/error
- Fetch hooks return `{ result: { data, total, params }, isFetching, fetchError, refetch }`

### Routing

- Routes defined in `Routes.tsx` with a `Paths` constant object
- Pages lazy-loaded via `React.lazy(() => import("./pages/<domain>"))`
- Each page directory has an `index.ts` that re-exports the default component: `export { SbomList as default } from "./sbom-list"`
