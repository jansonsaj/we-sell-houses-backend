# JANSONSA - We Sell Houses (Backend)

Coursework for 304CEM.

## MongoDB

Configured in [config/db.js](config/db.js)

Useful commands:

- Start: `sudo systemctl start mongod`
- Stop: `sudo systemctl stop mongod`
- Restart: `sudo systemctl restart mongod`
- Shell: `mongo`

## First time set up

1. Configure GIT to use local hooks:
   `git config core.hooksPath .githooks`
1. Install dependencies:
   `npm install`

## Documentation

Documentation resources are served at the same time as the server, but on another port: `3030` by default or specified with `DOCS_PORT` environment variable.

To find OpenAPI specification, run the server with `npm start` and visit [https://cable-elastic-3030.codio-box.uk/openapi](https://cable-elastic-3030.codio-box.uk/openapi)
