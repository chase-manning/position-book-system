# Position Book System

## Description

This project implements an in-memory Position Book system. It tracks real-time positions of traded securities, processes trade events (BUY, SELL, CANCEL), and exposes a REST API for event ingestion and position retrieval.

## Requirements

- Java 17+
- Maven 3.6+

## Build & Run

```sh
mvn clean package
mvn spring-boot:run
```

## API Endpoints

### 1. Process Trade Events

- **POST** `/api/trades`
- **Request Body:**

```json
{
  "Events": [
    {
      "ID": "1",
      "Action": "BUY",
      "Account": "ACC1",
      "Security": "SEC1",
      "Quantity": 100
    }
  ]
}
```

- **Response:** `200 OK`

### 2. Get All Positions

- **GET** `/api/positions`
- **Response Example:**

```json
{
  "Positions": [
    {
      "Account": "ACC1",
      "Security": "SEC1",
      "Quantity": 100,
      "Events": [
        {
          "ID": 1,
          "Action": "BUY",
          "Account": "ACC1",
          "Security": "SEC1",
          "Quantity": 100
        }
      ]
    }
  ]
}
```

### 3. Get Position by Account and Security

- **GET** `/api/positions/{account}/{security}`
- **Response Example:**

```json
{
  "Account": "ACC1",
  "Security": "SEC1",
  "Quantity": 100,
  "Events": [
    {
      "ID": 1,
      "Action": "BUY",
      "Account": "ACC1",
      "Security": "SEC1",
      "Quantity": 100
    }
  ]
}
```

## Notes

- All data is stored in memory; restarting the app clears all positions.
- CANCEL events must have the same Account/Security as the original event (per test case convention).
- Duplicate event IDs are not explicitly handled; the latest event with the same ID will be processed as received.

## Testing

Run all tests with:

```sh
mvn test
```

## License

MIT
