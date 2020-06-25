all:
CONTAINER_NAME = party-api
IMAGE_NAME = party-api-dev
IMAGE_NAME_PROD = party-api-prod
VERSION = 0.0.1
OFFICE_LATITUDE = 53.339428
OFFICE_LONGITUDE = -6.257664
OFFICE_INVITATION_THRESHOLD = 100

build-clean:
	rm -rf node_modules/*
	rm -rf package-lock.json

clean: build-clean

up:
	docker-compose up

tests:
	docker exec -it $(CONTAINER_NAME) npm run test

tests-e2e:
	docker exec -it $(CONTAINER_NAME) npm run test:e2e

run-sample:
	@curl -X POST "http://localhost:3000/v1/attendees/available" -H "accept: */*" -H "Content-Type: multipart/form-data" -F "file=@$(shell pwd)/test/attendee_list;type=text/plain"

ssh-exec:
	docker exec -it $(CONTAINER_NAME) sh

prod: clean
	docker rm $(IMAGE_NAME_PROD)_container
	docker build --tag $(IMAGE_NAME_PROD):$(VERSION) .
	docker run --publish 3000:8080 --env OFFICE_LATITUDE=$(OFFICE_LATITUDE) --env OFFICE_LONGITUDE=$(OFFICE_LONGITUDE) --env OFFICE_INVITATION_THRESHOLD=$(OFFICE_INVITATION_THRESHOLD) --detach --name $(IMAGE_NAME_PROD)_container $(IMAGE_NAME_PROD):$(VERSION)

prod-logs:
	docker logs -f $(IMAGE_NAME_PROD)_container

prod-kill:
	docker kill $(IMAGE_NAME_PROD)_container