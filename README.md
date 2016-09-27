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
* Any changes to the client code triggers a recompilation
* Any change to the server code restarts it

## TODO

* Use a local version of FontAwesome
* Only show transactions of selected account
* Adding transaction (handle split transactions)
* Taking split transactions into account
* Edit transaction inline
* Work on a production environment
* Category goals
