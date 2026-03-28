# Class Microservice

A RESTful microservice for managing wellness classes and slot reservations, built with Python Flask and MySQL, containerized with Docker.

---

## Prerequisites

Make sure you have the following installed before running this service:

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (includes Docker and Docker Compose)

No additional Python modules or software need to be installed manually — everything runs inside Docker containers.

---

## Project Structure

```
class-service/
├── app.py              # Main Flask application with all API endpoints
├── db.py               # MySQL database connection pool
├── init.sql            # Database schema (auto-run on first startup)
├── requirements.txt    # Python dependencies
├── Dockerfile          # Docker image build instructions
└── compose.yaml        # Docker Compose configuration
```

---

## Setup and Running

### Step 1 — Clone or Download the Project
Place all files in a folder called `class-service` on your local machine.

### Step 2 — Start the Service
Open a terminal, navigate to the `class-service` folder, and run:

```bash
docker-compose -f compose.yaml up --build
```

This will:
1. Build the Flask application Docker image
2. Pull and start a MySQL 8.0 database container
3. Automatically create the `classservice` database and tables using `init.sql`
4. Start the Flask REST API server

### Step 3 — Verify the Service is Running
You should see the following output in your terminal:

```
class-service-1  |  * Serving Flask app 'app'
class-service-1  |  * Running on http://0.0.0.0:5000
```

---

## Accessing the Service

| What | URL |
|---|---|
| REST API | http://localhost:5006 |
| Swagger UI (API Docs) | http://localhost:5006/apidocs |

Visit **http://localhost:5006/apidocs** in your browser to view and interact with all available API endpoints through the Swagger UI.

---

## Port Configuration

| Service | Host Port | Container Port |
|---|---|---|
| Class Service REST API | 5006 | 5000 |
| Class Service MySQL DB | 3303 | 3306 |

> If port 5006 or 3303 is already in use on your machine, update the ports in `compose.yaml` before running.

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/classes?date=YYYY-MM-DD&providerId=1` | Get classes by date and provider |
| POST | `/classes` | Create a new class |
| POST | `/classes/{classId}/reserve` | Reserve a slot (returns hold_id) |
| POST | `/classes/{classId}/release` | Release a reserved slot |
| POST | `/classes/{classId}/complete` | Mark a class as completed |

### Example: Create a Class
```bash
curl -X POST http://localhost:5006/classes \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": 1,
    "class_name": "Yoga Basics",
    "date": "2026-04-01",
    "start_time": "10:00:00",
    "duration": 60,
    "capacity": 20,
    "location": "Studio A, Level 2"
  }'
```

### Example: Reserve a Slot
```bash
curl -X POST http://localhost:5006/classes/1/reserve \
  -H "Content-Type: application/json" \
  -d '{"customer_id": 2}'
```

### Example: Release a Slot
```bash
curl -X POST http://localhost:5006/classes/1/release \
  -H "Content-Type: application/json" \
  -d '{"hold_id": 1}'
```

---

## Database

The database is automatically set up when the containers first start. No manual SQL setup is required.

- **Database name:** `classservice`
- **Tables:** `Class`, `ClassHold`
- **Root password:** `password`

### Resetting the Database
If you need to reset the database (e.g., after changing `init.sql`):

```bash
docker-compose -f compose.yaml down -v
docker-compose -f compose.yaml up --build
```

> The `-v` flag removes the existing database volume so it is recreated fresh.

---

## Stopping the Service

```bash
docker-compose -f compose.yaml down
```

To stop and also remove the database volume:

```bash
docker-compose -f compose.yaml down -v
```

---

## Python Dependencies

The following Python packages are used (auto-installed inside Docker):

| Package | Version | Purpose |
|---|---|---|
| flask | 3.0.0 | Web framework |
| mysql-connector-python | 8.2.0 | MySQL database connection |
| flasgger | 0.9.7.1 | Swagger UI for API documentation |

---

## Troubleshooting

**Port already in use:**
Change the host ports in `compose.yaml` under the `ports` section for `class-service` and `class-db`.

**Database not initializing:**
Ensure `init.sql` is in the same folder as `compose.yaml`. Then run:
```bash
docker-compose -f compose.yaml down -v
docker-compose -f compose.yaml up --build
```

**Module not found errors:**
Run with `--build` to ensure the Docker image is rebuilt with all dependencies:
```bash
docker-compose -f compose.yaml up --build
```
