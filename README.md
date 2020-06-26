# Party-api

## Description
Upload a list of attendees and discover who's within a certain radius to be invited

## Installation

``` git clone git@github.com:ehanoc/party-invite-api.git```

### Requirements
- docker
- make

## Run-time

```bash
$ cd party-invite-api
$ make up
```

## Environment

Swagger docs vailable at http://localhost:3000/docs

* You can upload a text file with the expected format to check the available attendees
* Sample file at _test/attendee_list_

Or open a new terminal session in projects root folder
```bash
# run endpoint against the sample file
$ make run-sample
```

## Test

```bash
# While the container is running
# Open new terminal window
$ cd party-invite-api

# unit tests
$ make tests

# e2e tests
$ make tests-e2e
```

If you prefer to run these outside the container
```bash
# make sure that you install deps locally first
$ npm install

# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e
```


## Production build and run-time

- Stop previous run-time env's 

```bash
# build and run
$ make prod

# check logs
$ make prod-logs

# kill
$ make prod-kill
```

## Stay in touch

- Author - [Bruno Martins](github.com/ehanoc)

## License
DWYW (Do what you want)
