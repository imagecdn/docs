# ImageCDN Docs

ImageCDN documentation is generated via Jekyll, and served via Nginx: This repository houses both.


### Building

This is Dockerized and the developmental workflow is handled via make.

To run: `make start`
To stop: `make stop`
To run tests: `make test`
To clean-up after any of the above: `make clean`


### Testing

There is a smoke-testing suite in place based on chai-http which ensures that the built container works as expected.
You can see the test suite under the [test](./test/) folder.


### Why not put this on a static host?

Docs is currently deployed alongside a number of microservices, and acts as a catch-all: Therefore it must be able to respond to HTTP requests.
Longer-term these responsibilities could be moved to another part of the CDN. (redirects are valid HTTP responses, after-all!)