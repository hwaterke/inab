# INAB

[![Build Status](https://travis-ci.org/hwaterke/inab.svg?branch=develop)](https://travis-ci.org/hwaterke/inab)

INAB is a budgeting tool.

This is a monorepo that contains different packages

* [server](server) contains the server files (Ruby)
* [packages/inab-web](packages/inab-web) contains the web app
* [packages/inab-native](packages/inab-native) contains the mobile app
* [packages/inab-shared](packages/inab-shared) contains common file for web and native apps

# Use

There are several ways of deploying and using INAB.  
The simplest solution that works out of the box is to use the existing docker image.

```
docker run -d -p 8080:8080 -v $(pwd)/database:/db hwaterke/inab:api
```

This starts the server. You then need to build and serve the frontend code yourself.
You can then access INAB api at http://localhost:8080/api

When running the docker image, it is recommended to add another environment variable.
`-e "JWT_SECRET=some_secret"`.
This is optional, a random secret will be used if none is provided.
But providing one will allow your users to stay connected after a container restart.

### Production build

If you want to create the docker image yourself, execute the following steps.

* Navigate to the `server` folder.
* Execute `./build-docker.sh`

You can then run inab by using:

```
docker run -d -p 8080:8080 -v $(pwd)/database:/db hwaterke/inab:api
```

### Migrate database

If you've been using a previous version of INAB, you will need t migrate your database.
Make a copy of your existing database e.g. old_database.db.
Start the new version of INAB and let it create a new (empty) database.

Run the following:

```
docker run --rm -v $(pwd):/app/migration/dbs hwaterke/inab-migration dbs/old_database.db dbs/new_database.db
```

This will migrate all the data in the old database to the new database that you can then use with the latest version of INAB.

### Development

If you want to contribute and help developing INAB, you can use the development configuration.

The `docker-compose.yml` file at the root of the project starts the server in development mode.

With the following command `docker-compose up`, you will get the following:

* No need to install ruby (server)
* Server (API) listens on port 8080
* Any change to the server code restarts it

Once the server is up and running, you need to bootstrap the repo and compile the shared code:

```
yarn lerna bootstrap
cd packages/inab-shared
yarn build
yarn build:flow
```

You can then start the client in dev mode by issuing the following commands in the `packages/inab-web` folder:

```
yarn
yarn start
```

Note that in development, the server uses an in-memory database.

# Some todos

* Aggregate stats per budget category
* Use bootstrap via npm (css only, avoid javascript by using reactstrap)
* Fix onBlur on the inputs in the budget table
* Fix the select with add new value
* Create a design identity (palette etc.)
* Disallow transfers between an account and itself
* Reorder categories by drag and drop
* Category goals
* Native Mobile App
* Form validation with redux-form
  * Create a generic input Field with label and errors handling
* Remove arrow function creation in render methods (performance)
* Add a button of type submit to the forms to allow ENTER
