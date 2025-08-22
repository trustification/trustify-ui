# Developing tests

This document describes:

- the layout of the `e2e` tests

- how to contribute a test

- how to set up your environment to run the `e2e` tests on your local
  environment

## Repository Layout

The layout of the `e2e` repository looks like follows:

```
.
├── package.json
├── playwright.config.ts
├── etc
└── tests
    ├── api
    │   ├── fixtures.ts
    │   ├── client
    │   ├── dependencies
    │   ├── features
    │   └── helpers
    ├── common
    │   ├── constants.ts
    │   └── assets
    │       ├── csaf
    │       └── sbom
    └── ui
        ├── dependencies
        ├── features
        │   ├── *.feature
        │   ├── @sbom-explorer
        │   └── @vulnerability-explorer
        ├── helpers
        └── steps
```

- `package.json` - project configuration the `npm` ([Node.js Package Manager](https://docs.npmjs.com/))
  understands; you can define your scripts (commands) here that you can then
  execute by `npm run <your command>`

- `playwright.config.ts` - a configuration for [Playwright](https://playwright.dev/docs/intro)
  and [Playwright-BDD](https://vitalets.github.io/playwright-bdd/#/)

- `config` contains configuration files that are common for the repository;
  currently it contains

  - `openapi.yaml` - a file with the [Trustify](https://github.com/trustification/trustify)
    API definition; every time the file changes on the [Trustify](https://github.com/trustification/trustify)
    side it should be also updated here

  - `openapi-ts.config.ts` - a configuration for `@hey-api/openapi-ts` telling
    it how to generate the content of `tests/api/client`; whenever this or
    `openapi.yaml` file changes `npm run openapi` should be executed to update
    the content of `tests/api/client`

- `etc` contains auxiliary files such as Podman/Docker compose files to start
  a Playwright container

- `tests/api` contains API tests organized as follows

  - `fixtures.ts` - API tests fixtures written in TypeScript

  - `client` contains a TypeScript interface to [Trustify](https://github.com/trustification/trustify)
    API generated from `config/openapi.yaml` by `npm run openapi`

  - `dependencies` contains setup and tear down routines which are run before
    the start and after the end of the API test suite, respectively

  - `features` contains API tests itself; `_openapi_client_examples.ts` shows
    how to use generated TypeScript interface to [Trustify](https://github.com/trustification/trustify)
    in API tests

  - `helpers` contains auxiliary utilities used by API tests

- `tests/common` contains data and definitions shared by both API and UI tests

  - `constants.ts` - constant definitions used by both API and UI tests

  - `assets/csaf` contains compressed (`bz2`) samples of CSAF files

  - `assets/sboms` contains compressed (`bz2`) samples of SBOM files

- `tests/ui` contains UI tests; UI tests are developed following BDD (Behavior
  Driven Development) methodology; the directory is organized as follows

  - `dependencies` contains setup and tear down routines which are run before
    the start and after the end of the UI test suite, respectively

  - `features` contains the UI tests itself; the content of the directory is
    further organized as follows

    - `*.feature` files are test scenarios described in [Gherkin](https://cucumber.io/docs/gherkin/);
      `*.feature` files on the top level of the `tests/ui/features` directory
      describe scenarios that need to be implemented first in the [front end](https://github.com/trustification/trustify-ui);
      that is, they describe the expected front end behavior

    - `@*` directories contain `*.feature` files and `*.step.ts` files used to
      test the so far implemented [front end](https://github.com/trustification/trustify-ui)
      features; see also [Tags from path](https://vitalets.github.io/playwright-bdd/#/writing-steps/scoped?id=tags-from-path)
      documentation

  - `helpers` contains auxiliary utilities used by UI tests

  - `steps` contains implementation of common BDD steps used in `tests/ui/features`

## Contributing a Test

To contribute an API test, put your code under the `tests/api/features` directory.
If the test also contains a generic code that could be shared by more API tests,
put that code under the `tests/api/helpers` directory. In a case that code is
also intended to be shared by UI tests, put it under the `tests/common` directory
instead. If you have also some assets that need to be contributed together with
the test, put them under the `tests/common/assets` directory.

To contribute a UI (front end) test, put your code under the `tests/ui/features`
directory. Depending on the status of a feature your test is trying to cover,
there are two ways of how to proceed:

1. **A test is covering an implemented UI feature.** Put your test under
   a `tests/ui/features/@*` directory. You can choose from the existing or create
   your own depending on your use case.

1. **A test is covering a use case (scenario) not yet implemented.** Describe
   your use case in [Gherkin](https://cucumber.io/docs/gherkin/) and put it
   inside a `tests/ui/features/*.feature` file. The use case should be
   communicated with the [upstream](https://github.com/trustification/trustify-ui)
   before. Once the upstream implements the requested features covering your use
   case, the next step is to put your `*.feature` file(s) under a `tests/ui/features/@*`
   directory and implement missing steps to make it work under the Playwright
   BDD framework.

Other directories you should be interested in when contributing a UI test:

- `tests/common` (described earlier)

- `tests/ui/helpers` follows the same rules as `tests/api/helpers`

- `tests/ui/steps` is intended to be a right place for steps that are common
  across many use cases (scenarios)

## System Requirements

Playwright is officially [supported](https://playwright.dev/docs/intro#system-requirements)
to:

- Windows 10+, Windows Server 2016+ or Windows Subsystem for Linux (WSL)
- macOS 13 Ventura, or later
- Debian 12, Ubuntu 22.04, Ubuntu 24.04, on x86-64 and arm64 architecture

To run Playwright on [unsupported Linux distributions](https://github.com/microsoft/playwright/issues/26482)
like Fedora, Playwright can be configured on docker/podman and the tests can be
executed from the client (local machine). To do this, follow the section below.

## Running Playwright as Docker/Podman Container

First, clean-install the requirements:

```shell
npm ci
```

Then, get the Playwright version (it is important that client and server
versions of Playwright must match, otherwise you get `<ws unexpected response>
ws://localhost:5000/ 428 Precondition Required`-like error when you try to run
tests):

```shell
export PLAYWRIGHT_VERSION="v$(npx playwright --version | cut -d' ' -f2)"
```

By default, Playwright is listening on port `5000` (the default value of
`PLAYWRIGHT_PORT` from `etc/playwright-compose/.env`). You can override this
value if it is already taken by the system or other application:

```shell
export PLAYWRIGHT_PORT=<your choice of port number>
```

Then, start the Playwright service (you can override `etc/playwright-compose/.env`
by exporting environment variables with your own values as demonstrated above or
you can just pass to `{docker,podman}-compose` your own `.env` file via
`--env-file <env_file>` CLI option):

```shell
podman-compose -f etc/playwright-compose/compose.yaml up
```

After a while, the container should be in `Ready` state and you should see the
output (replace `5000` by the value of `PLAYWRIGHT_PORT`):

```
Listening on ws://127.0.0.1:5000/
```

Now you can execute the Playwright tests (again, replace `5000` by the value of
`PLAYWRIGHT_PORT`):

```shell
TRUSTIFY_UI_URL=http://localhost:8080 PW_TEST_CONNECT_WS_ENDPOINT=ws://localhost:5000/ npm run test
```

When you are finished with testing, you can shut down the container by `Ctrl+C`
and:

```shell
podman-compose -f etc/playwright-compose/compose.yaml down
```
