# INAB

[![Build Status](https://img.shields.io/travis/hwaterke/inab/master.svg?style=flat-square)](https://travis-ci.org/hwaterke/inab)

INAB is a budgeting tool.

# Use
There are several ways of deploying and using INAB.  
The simplest solution that works out of the box is to use the existing docker image.

```
docker run -d -p 8080:8080 -v $(pwd)/database:/db hwaterke/inab
```
You can then access INAB at http://localhost:8080

### Production build
If you want to create the docker image yourself, execute the following steps.

- Build the frontend by using `./build.sh` in  the `client` folder.
- Copy the `dist` folder in `client` to the `server` folder.
- Run `docker build -t inab -f Dockerfile-prod-all .`

You can then run inab by using:
```
docker run -d -p 8080:8080 -v $(pwd)/database:/db inab
```

### Production build - API
The docker image above contains both the API and the frontend.
In some cases tough, you might want to serve the frontend in a different way, by using a reverse proxy for example e.g. NGINX. It is therefore possible to build a docker image that only contains the API and not the frontend.

Simply go to the server folder and run `docker-compose up`

Serving the frontend i.e. the content of the dist folder to your client is then left to you.

### Development

If you want to contribute and help developing INAB, you can use the development configuration.

The docker-compose file at the root of the project takes care of everything.

With the following command `docker-compose up`, you will get the following:
* No need to install npm (client)
* No need to install ruby (server)
* Client code is compiled automatically (HMR)
* Server (API) listens on port 8080
* Website is served at http://localhost:3000
* Any change to the client code triggers a recompilation
* Any change to the server code restarts it

Note that in development, the server uses an in-memory database.

# TODO
* Transaction model
  * Clearing transactions
  * Method for transactions (method of payment)
  * Generic tags for transactions
* Production build, make scripts. Build inab:api for the api only
* Aggregate stats per budget category
* Use bootstrap via npm
* Fix onBlur on the inputs in the budget table
* Fix the select with add new value
* Add Time in addition to date for transactions?
* Display list of transactions for one category of the month (= search)
* Create a design identity (palette etc.)
* Server side make sure dates of budget items are months
* Server side make sure there can be only one budget item per month and category
* Disallow transfers between an account and itself
* Reorder categories by drag and drop
* Write server tests
* Replace redux-crud, store entities by ID
* Category goals
* Migrate to TypeScript/flow
* Authentication (login/register)
* Add favicon
* Internationalization
* Native Mobile App
* Enforce one type of quotes with ESLint
