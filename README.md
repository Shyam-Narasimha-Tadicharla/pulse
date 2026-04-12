# PULSE — Microservices Platform

A distributed microservices system built with Java 21 and Spring Boot. PULSE manages entities (subjects) across 5 independently deployable services communicating via REST, gRPC, and Kafka. Each service is containerized with Docker and routed through a central API Gateway with JWT authentication.

---

## Architecture Overview

```
Client
  │
  ▼
API Gateway (port 4004)          ← Spring Cloud Gateway, JWT validation filter
  ├── /auth/**      → Auth Service      (port 4005)
  └── /api/**       → Entity Service   (port 4000)
                            │
                            ├── gRPC → Billing Service  (port 4001 / gRPC 9001)
                            └── Kafka → Analytics Service (consumer, topic: "subject")
```

---

## Services

### 1. `entity-service` — Subject Management (REST + gRPC client + Kafka producer)
The core domain service. Manages `Subject` records (name, email, address, date of birth).

- **REST API** exposed at port `4000`, documented via Swagger UI (`/swagger-ui.html`)
- **gRPC client** calls `billing-service` to create a billing account on subject creation
- **Kafka producer** publishes `SubjectEvent` (Protobuf-encoded) to the `subject` topic on create/update/delete
- **Database**: PostgreSQL (production), H2 (test/dev)

| Endpoint | Method | Description |
|---|---|---|
| `/subjects` | GET | List all subjects |
| `/subjects` | POST | Create a subject (triggers gRPC + Kafka) |
| `/subjects/{id}` | PUT | Update a subject |
| `/subjects/{id}` | DELETE | Delete a subject |

---

### 2. `billing-service` — Billing Account Management (gRPC server)
Receives gRPC calls from entity-service to create billing accounts when a new subject is registered.

- Exposes a gRPC server on port `9001`
- REST server on port `4001`
- Proto contract: `billing_service.proto` — `createBillingAccount(BillingRequest)` → `BillingResponse`

---

### 3. `auth-service` — Authentication (JWT)
Issues and validates JWT tokens for API access.

- `POST /login` — validates credentials, returns a signed JWT (10-hour expiry, HMAC-SHA)
- JWT contains `email` + `role` claims
- Spring Security configured for stateless auth
- Port `4005`

---

### 4. `api-gateway` — Routing + JWT Guard (Spring Cloud Gateway)
Single entry point for all external traffic. Routes requests and enforces auth.

- Port `4004`
- Routes:
  - `/auth/**` → auth-service (public, no JWT check)
  - `/api/subjects/**` → entity-service (JWT validation filter applied)
  - `/api-docs/subjects` → entity-service Swagger docs
  - `/api-docs/auth` → auth-service Swagger docs
- `JwtValidationGatewayFilterFactory` — custom filter that validates Bearer tokens before forwarding

---

### 5. `analytics-service` — Event Consumer (Kafka)
Subscribes to the `subject` Kafka topic and processes `SubjectEvent` Protobuf messages for analytics.

- Kafka consumer group: `analytics-service`
- Deserializes Protobuf `SubjectEvent` from raw bytes
- Logs subject ID, name, and email on each event (extensible for analytics business logic)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Language | Java 21 |
| Framework | Spring Boot 3.5 |
| REST | Spring Web (REST Controllers) |
| API Docs | SpringDoc OpenAPI / Swagger UI |
| Sync Comms | gRPC 1.69 + Protobuf 4.29 |
| Async Comms | Apache Kafka + Spring Kafka 3.3 |
| Auth | Spring Security + JJWT (HMAC-SHA JWT) |
| Gateway | Spring Cloud Gateway |
| Database | PostgreSQL (prod), H2 (dev/test) |
| ORM | Spring Data JPA |
| Containerization | Docker (Dockerfile per service) |
| Build | Maven (per-service `pom.xml` + Maven Wrapper) |

---

## Project Structure

```
pulse/
├── api-gateway/          # Spring Cloud Gateway — routing + JWT filter
├── auth-service/         # Login endpoint, JWT generation
├── entity-service/       # Subject CRUD, gRPC client, Kafka producer
├── billing-service/      # gRPC server — billing account creation
├── analytics-service/    # Kafka consumer — subject event processing
└── api-requests/         # IntelliJ HTTP request files for manual testing
    └── subject-service/
        ├── update-subject.http
        └── delete-subject.http
```

---

## Communication Patterns

| From | To | Protocol | Trigger |
|---|---|---|---|
| API Gateway | Auth Service | REST (HTTP) | `/auth/**` requests |
| API Gateway | Entity Service | REST (HTTP) | `/api/subjects/**` (after JWT check) |
| Entity Service | Billing Service | gRPC | On subject creation |
| Entity Service | Kafka | Protobuf over Kafka | On subject create/update/delete |
| Analytics Service | Kafka | Protobuf consumer | Listens on `subject` topic |

---

## Protobuf Contracts

- `billing_service.proto` — `BillingRequest` / `BillingResponse` (used by entity-service gRPC client + billing-service gRPC server)
- `subject_event.proto` — `SubjectEvent` (used by entity-service Kafka producer + analytics-service Kafka consumer)

Proto files are compiled at build time via the `protobuf-maven-plugin`.

---

## Getting Started

### Prerequisites
- Java 21
- Docker + Docker Compose
- Maven (or use the `./mvnw` wrapper in each service)
- PostgreSQL instance (or use Docker)
- Kafka broker running (e.g. via Docker)

### Run a single service locally
```bash
cd entity-service
./mvnw spring-boot:run
```

### Build a Docker image (per service)
```bash
cd entity-service
docker build -t pulse-entity-service .
```

### Environment variables (entity-service example)
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/pulse
spring.datasource.username=postgres
spring.datasource.password=yourpassword
jwt.secret=<base64-encoded-secret>
```

---

## Seed Data

Entity-service seeds 15 sample subjects into PostgreSQL on startup via `data.sql` (using `INSERT ... WHERE NOT EXISTS` to be idempotent).

---

## Deployment

Not deployed yet. Each service has a `Dockerfile` ready for containerized deployment.

---

## Assumptions & Notes

- The `auth-service` password validation logic is in `AuthService.java` / `UserService.java` — assumed to use BCrypt based on Spring Security config, though not verified
- The `analytics-service` logs events but does not persist them — analytics storage would be the next extension point
- Each service has its own `pom.xml`; there is no parent multi-module Maven POM (each service is built independently)
- IntelliJ IDEA HTTP client request files are stored in `.idea/httpRequests/` and `api-requests/` for local testing reference

---

## Author

**Shyam Narasimha Tadicharla**
GitHub: [Shyam-Narasimha-Tadicharla](https://github.com/Shyam-Narasimha-Tadicharla) | LinkedIn: [shyam-narasimha-tadicharla-750b6727a](https://www.linkedin.com/in/shyam-narasimha-tadicharla-750b6727a/)
