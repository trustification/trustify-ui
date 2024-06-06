# frontend

[![CI](https://github.com/trustification/trustify-ui/actions/workflows/ci-actions.yaml/badge.svg)](https://github.com/trustification/trustify-ui/actions/workflows/ci-actions.yaml)

## dev-env

### Requisites

- NodeJS 20. Use [nvm](https://github.com/nvm-sh/nvm?tab=readme-ov-file#install--update-script) to install NodeJS

```shell
nvm install 20
nvm use 20
```

- Backend. Clone [trustify](https://github.com/trustification/trustify) and there execute:

```shell
cargo run --bin trustd
```

It will start the backend in http://localhost:8080

### Install dependencies

```shell
npm clean-install --ignore-scripts
```

### Init the dev server

```shell
npm run start:dev
```

> Known issue: after installing the dependencies for the first time and then executing `npm run start:dev` you will see
> an error
> `config/webpack.dev.ts(18,8): error TS2307: Cannot find module '@trustify-ui/common' or its corresponding type declarations`
> Stop the command with Ctrl+C and run the command `npm run start:dev` again and the error should be gone. This only
> happens the very first time we install dependencies in a clean environment, subsequent commands `npm run start:dev`
> should not give that error. (bug under investigation)

Open browser at <http://localhost:3000>

## Environment variables

| ENV VAR             | Description                   | Default value                           |
| ------------------- | ----------------------------- | --------------------------------------- |
| TRUSTIFY_API_URL    | Set Trustification API URL    | `http://localhost:8080`                 |
| AUTH_REQUIRED       | Enable/Disable authentication | true                                    |
| OIDC_CLIENT_ID      | Set Oidc Client               | frontend                                |
| OIDC_SERVER_URL     | Set Oidc Server URL           | `http://localhost:8090/realms/trustify` |
| OIDC_SCOPE          | Set Oidc Scope                | openid                                  |
| ANALYTICS_ENABLED   | Enable/Disable analytics      | false                                   |
| ANALYTICS_WRITE_KEY | Set Segment Write key         | null                                    |

## Mock data

Enable mocks:

```shell
export MOCK=stub
```

Start app:

```shell
npm run start:dev
```

Mock data is defined at `client/src/mocks`

## crate

> [!NOTE]
> When using the crate it is expected to build the UI always in Prod mode
