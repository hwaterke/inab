## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## CLI

The backend comes with a CLI.

Before using it you need to build the project with `npm run build`.

```bash
# Create a new bank account
./bin/run accounts create --name "ING" --iban "BE00000000000000"

# List all bank accounts
./bin/run accounts list
```
