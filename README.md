# Position Book System

## Description

This project implements an in-memory Position Book system. It tracks real-time positions of traded securities, processes trade events (BUY, SELL, CANCEL), and exposes a REST API for event ingestion and position retrieval. It includes a front end to create events, view events, and show a dashboard overview.

## API

### Requirements

- Java 17+
- Maven 3.6+

### Build & Run

```sh
cd api
mvn spring-boot:run
```

### Testing

Run all tests with:

```sh
mvn test
```

## Frontend Application

### Features

- View all trade events in a grid with sorting and filtering.
- Create new trade events (BUY, SELL).
- Cancel existing trade events.
- Real-time updates of positions and events.

### Running the Frontend

```sh
cd app
yarn install
yarn dev
```

### Testing the Frontend

Run the frontend tests with:

```sh
yarn test
```

## License

MIT
