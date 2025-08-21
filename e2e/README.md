# End-to-End Tests

## Requirements

- NodeJS 22
- A running instance of Trustify

## Running the Tests

- Install dependencies:

  ```shell
  npm ci
  ```

- Point the tests to a running instance of Trustify:

  ```shell
  export TRUSTIFY_UI_URL=http://localhost:8080
  ```

- Run the tests:

  ```shell
  npm run test
  ```

- For other methods and operating systems, see [Developing tests](DEVELOPING.md)

## Environment Variables

General:

| Variable       | Default Value | Description                                     |
|----------------|---------------|-------------------------------------------------|
| LOG_LEVEL      | info          | Possible values: debug, info, warn, error, none |
| SKIP_INGESTION | false         | If to skip initial data ingestion/cleanup       |

For UI tests:

| Variable                 | Default Value         | Description                              |
|--------------------------|-----------------------|------------------------------------------|
| TRUSTIFY_UI_URL          | http://localhost:3000 | The UI URL                               |
| AUTH_REQUIRED            | true                  | Whether or not auth is enabled in the UI |
| PLAYWRIGHT_AUTH_USER     | admin                 | User name to be used when authenticating |
| PLAYWRIGHT_AUTH_PASSWORD | admin                 | Password to be used when authenticating  |

For API tests:

| Variable                      | Default Value                                   | Description                                                                                                         |
|-------------------------------|-------------------------------------------------|---------------------------------------------------------------------------------------------------------------------|
| TRUSTIFY_API_URL              | TRUSTIFY_UI_URL otherwise http://localhost:8080 | The API URL                                                                                                         |
| AUTH_REQUIRED                 | true                                            | Whether or not auth is enabled in the API                                                                           |
| PLAYWRIGHT_AUTH_URL           |                                                 | OIDC Base URL, e.g. `http://localhost:9090/realms/trustd`. If not set, we will try to discover it from `index.html` |
| PLAYWRIGHT_AUTH_CLIENT_ID     | cli                                             | OIDC Client ID                                                                                                      |
| PLAYWRIGHT_AUTH_CLIENT_SECRET | secret                                          | OIDC Client Secret                                                                                                  |

## Available Commands

There are some pre-configured commands you can use:

| Variable              | Description                                                                       |
|-----------------------|-----------------------------------------------------------------------------------|
| npm run test          | Execute UI and API tests                                                          |
| npm run test:ui       | Execute UI tests                                                                  |
| npm run test:ui:trace | Execute UI tests and take screenshots                                             |
| npm run test:ui:host  | Opens the Playwright UI in the browser of your OS                                 |
| npm run test:api      | Execute API test                                                                  |
| npm run format:fix    | Reformat source code according using `biome` (use before committing code changes) |

You can also execute any `playwright` or [`playwright-bdd`](https://vitalets.github.io/playwright-bdd)
command directly in your terminal.
