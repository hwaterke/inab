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
* Aggregate stats per budget category
* Review production builds and make easier options to deploy
* Allow to sort on any column in the account page
* Use bootstrap via npm
* Fix the select with add new value
* Add Time in addition to date for transactions?
* Allow to search in transactions
* Display list of transactions for one category of the month (= search)
* Create a design identity (palette etc.)
* Server side make sure dates of budget items are months
* Server side make sure there can be only one budget item per month and category
* Add a landing page (will be used for login)
* Transfers need to be rendered positive on one account and negative on the other
* Disallow transfers between an account and itself
* Reorder categories by drag and drop
* Write server tests
* Replace redux-crud, store entities by ID
* Category goals
* Migrate to TypeScript
* Authentication (login/register)
* Add favicon
* Internationalization
* Native Mobile App
