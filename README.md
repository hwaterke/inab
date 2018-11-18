# INAB

[![Build Status](https://travis-ci.org/hwaterke/inab.svg?branch=develop)](https://travis-ci.org/hwaterke/inab)

INAB is a budgeting tool.

This is a monorepo that contains different packages

- [packages/web](packages/web) contains the web app
- [packages/native](packages/native) contains the mobile app
- [packages/shared](packages/shared) contains common files for web and native apps
- [packages/server](packages/server) contains the server

# Use

INAB consists of two parts. A backend that exposes an API and a frontend (web or native).
There are several ways of deploying and using INAB.  
The simplest solution that works out of the box is to use the existing docker image for the backend

```
docker run -d -p 3003:3003 -v $(pwd)/database:/db hwaterke/inab-api
```

This starts the server.
You can then access the INAB api at http://localhost:3003

You then need to build and serve the frontend code yourself or use the latest version deployed at https://inab.accountant/

When running the docker image, it is recommended to add another environment variable.
`-e "TOKEN_SECRET=some_secret"`.
This is optional, a random secret will be used if none is provided.
But providing one will allow your users to stay connected after a container restart.

### Production build

If you want to create the docker image yourself, execute the following steps.

- Navigate to the `packages/server` folder.
- Execute `./docker_build.sh`

You can then run inab by using:

```
docker run -d -p 8080:8080 -v $(pwd)/database:/db hwaterke/inab-api
```

### Development

If you want to contribute and help developing INAB, you can use the development configuration.

You first need to bootstrap the repo and compile the shared code:

```
yarn
cd packages/shared
yarn build
yarn build:flow
```

You can then start the server in dev mode by issuing the following commands in the `packages/server` folder:

```
yarn start
```

Once the server is up and running, you can then start the client in dev mode by issuing the following commands in the `packages/web` folder:

```
yarn start
```

Note that in development, the server uses an in-memory database.

# Some todos

- Aggregate stats per budget category
- Fix onBlur on the inputs in the budget table
- Fix the select with add new value
- Create a design identity (palette etc.)
- Disallow transfers between an account and itself
- Reorder categories by drag and drop
- Add a button of type submit to the forms to allow ENTER
