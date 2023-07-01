# INAB

[![Build Status](https://travis-ci.org/hwaterke/inab.svg?branch=develop)](https://travis-ci.org/hwaterke/inab)

INAB is a budgeting tool.

# Usage

INAB is a web application.

The easiest is to run everything locally using docker-compose.

```
version: '3.6'
services:
  inab:
    image: hwaterke/inab
    environment:
      - IMPORT_FOLDER=/app/imports
    ports:
      - '3000:3000'
    volumes:
      - ./data:/app/data
      - ./imports:/app/imports
```

You can then open your browser at http://localhost:3000

## Importing transactions

INAB can import transactions from CSV and JSON files. As of today, INAB can
import transactions from the following banks:

- [x] ING
- [x] N26
- [x] N26 (through API export)
- [ ] Belfius
- [ ] VanBreda

Simply drop your CSV or JSON file in the `imports` folder and restart the
container. Transactions will not be imported twice so you can safely keep the
files in the `imports` folder.

### How to export N26 transaction through the API

```shell
git clone git@github.com:femueller/python-n26.git
pipenv shell
pipenv install
python3 -m n26 -json transactions --limit 1000 > n26.json
```

## Compile

If you want to create the docker image yourself, execute the following steps.

- Execute `./scripts/docker_build.sh`

You can then use the docker-compose file from above.

### Development

If you want to contribute and help developing INAB, you can use the development
configuration. A new version is under development The backend is in
backend-nestjs and the frontend in web-vite.

# Some todos

- Aggregate stats per budget category
- Fix onBlur on the inputs in the budget table
- Fix the select with add new value
- Create a design identity (palette etc.)
- Disallow transfers between an account and itself
- Reorder categories by drag and drop
- Add a button of type submit to the forms to allow ENTER
