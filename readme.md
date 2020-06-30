# The Need

The Need is a website for placement and response to help announcements

## Launching

Use the pakage manager [yarn](https://classic.yarnpkg.com/en/docs/install/#mac-stable) to run the project. Install the dependencies:

```bash
yarn
```

To work with the database, the application needs the database. If you wanna to do it quiqkly, you can run the postgress in Docker (https://docs.docker.com/get-docker/). After installing the Docker, create and run container:

```bash
docker run -d -p 6432:5432 -e POSTGRES_USER='need' -e POSTGRES_PASSWORD='password'  postgres:12.2-alpine
```

Copy the contents from the .env.example to .env file and fill it with contents.

Сreate tables in the database:

```bash
knex migrate: latest
```

Finally run the application!

```bash
yarn start:dev
```
