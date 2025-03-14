# Trustify-ui

[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/trustification/trustify-ui/pulls)

Trustify UI Component

# Build and Test Status

| branch | last merge CI | last merge image build | nightly CI |
| :----- | :------------ | :--------------------- | :--------- |
| main   | [![CI (repo level)](https://github.com/trustification/trustify-ui/actions/workflows/ci-repo.yaml/badge.svg?branch=main&event=push)](https://github.com/trustification/trustify-ui/actions/workflows/ci-repo.yaml?query=branch%3Amain+event%3Apush)           | [![Multiple Architecture Image Build](https://github.com/trustification/trustify-ui/actions/workflows/image-build.yaml/badge.svg?branch=main&event=push)](https://github.com/trustification/trustify-ui/actions/workflows/image-build.yaml?query=branch%3Amain+event%3Apush)                    | [![Nightly CI (repo level @main)](https://github.com/trustification/trustify-ui/actions/workflows/nightly-ci-repo.yaml/badge.svg?branch=main&event=schedule)](https://github.com/trustification/trustify-ui/actions/workflows/nightly-ci-repo.yaml?query=branch%3Amain+event%3Aschedule)       |

| branch | last merge e2e CI | nightly e2e CI |
| :----- | :---------------- | :------------- |
| main   | [![CI (global Trustify CI)](https://github.com/trustification/trustify-ui/actions/workflows/ci-global.yaml/badge.svg?branch=main&event=push)](https://github.com/trustification/trustify-ui/actions/workflows/ci-global.yaml?query=branch%3Amain+event%3Apush)               | [![Nightly CI (global trustify CI @main)](https://github.com/trustification/trustify-ui/actions/workflows/nightly-ci-global.yaml/badge.svg?branch=main&event=schedule)](https://github.com/trustification/trustify-ui/actions/workflows/nightly-ci-global.yaml?query=branch%3Amain+event%3Aschedule)            |

## Development

### Requisites

[NodeJS](https://nodejs.org) >= 22. Use [nvm](https://nodejs.org/en/download) to install NodeJS

```shell
nvm install 22
nvm use 22
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

## Crate

> [!NOTE]
> When using the crate it is expected to build the UI always in Prod mode

## Contributing

We welcome contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting changes.
