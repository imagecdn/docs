SHELL := /bin/bash

.PHONY: build clean start stop test

build:
	docker build -t imagecdn/docs:dev .

clean: stop
	docker rmi -f imagecdn/docs

start: build
	docker run -d --name imagecdn-docs -P imagecdn/docs:dev

stop:
	docker rm -f imagecdn-docs

test: build start
	IMAGECDN_DOCS_HOST=`docker port imagecdn-docs 80` npm run test