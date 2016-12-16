# inab

[![Build Status](https://img.shields.io/travis/hwaterke/inab/master.svg?style=flat-square)](https://travis-ci.org/hwaterke/inab)

INAB is a budgeting tool.

# Production

## Build the client files.
Go to the `client/` folder and run `./build.sh`

## Deploy the API
Copy the `server/` folder on your host and run the `docker-compose` inside.

## Use NGINX to serve the client files and redirect the api to the container.
See github.com/hwaterke/proxy to achieve this.

# Development

The docker-compose file at the root of the project can be used for development.

With the following command `docker-compose up`, you will get the following:
* No need to install npm (client)
* No need to install ruby (server)
* Client code is compiled automatically
* Server starts on port 8080
* Website is served at localhost:3000
* Any change to the client code triggers a recompilation
* Any change to the server code restarts it

## TODO
* Use bootstrap via npm
* Fix the select with add new value
* Add a router
* Transfers need to be rendered positive on one account and negative on the other
* Reorder categories by drag and drop
* Display list of transactions for one category of the month
* Adding transaction (handle split transactions)
* Write server tests
* Replace redux-crud, store entities by ID
* Category goals
* Migrate to TypeScript
* Authentication (login/register)
* Improve styling
* Add favicon
* Internationalization
* Native Mobile App
