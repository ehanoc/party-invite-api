# Party-api

## Description

Upload a list of attendees and discover who's within a certain radius to be invited

## Installation

``` git clone git@github.com:ehanoc/party-invite-api.git```


## Run-time

```bash
$ make up
```

## Environment

Swagger docs vailable at http://localhost:3000/docs

* You can upload a text file with the expected format to check the available attendees
* Sample file at _test/attendee_list_

Or 
```bash
# run endpoint against the sample file
$ make run-sample
```

## Test

```bash
# unit tests
$ make tests

# e2e tests
$ make tests-e2e
```
## Production build and run-time

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
