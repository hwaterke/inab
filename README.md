# inab

[![Build Status](https://img.shields.io/travis/hwaterke/inab/master.svg?style=flat-square)](https://travis-ci.org/hwaterke/inab)

INAB is a budgeting tool.

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
* Creation of categories
* Reorder categories
* Display list of transactions for one category of the month
* Adding transaction (handle split transactions)
* Edit transaction inline
* Work on a production environment
* Write server tests
* Add authentication to the API
* Category goals
