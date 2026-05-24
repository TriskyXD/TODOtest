# TODO Backend

A REST API for managing TODO tasks, built with Go and MS SQL Server.

## Requirements

- [Go 1.23+](https://go.dev/dl/)
- [Docker](https://www.docker.com/) with Docker Compose

## Running the project

### 1. Install Go dependencies

```bash
go mod tidy
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

The defaults in `.env.example` work out of the box for local development — no changes needed.

### 3. Start MS SQL in Docker

```bash
docker compose up -d
```

The first startup takes about 20–30 seconds while SQL Server initialises. The Go app will retry automatically, so you can run both together.

### 4. Start the server

```bash
go run ./cmd/server
```

The app will:
1. Connect to SQL Server
2. Create the `tododb` database if it does not exist
3. Create the `todos` table if it does not exist
4. Start listening on `http://localhost:8080`

---

## API Reference

All endpoints accept and return `application/json`.

### Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/todos` | List all tasks |
| `GET` | `/todos/{id}` | Get one task |
| `POST` | `/todos` | Create a task |
| `PUT` | `/todos/{id}` | Replace a task |
| `PATCH` | `/todos/{id}/complete` | Toggle completed status |
| `DELETE` | `/todos/{id}` | Delete a task |

### Response shape

**Todo object:**
```json
{
  "id": 1,
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "completed": false,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

**Error response:**
```json
{ "error": "todo not found" }
```

---

## Example requests

```bash
# Create a task
curl -X POST http://localhost:8080/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Buy groceries", "description": "Milk and eggs"}'

# List all tasks
curl http://localhost:8080/todos

# Get one task
curl http://localhost:8080/todos/1

# Mark as completed
curl -X PATCH http://localhost:8080/todos/1/complete \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'

# Update a task (replaces title, description, and completed)
curl -X PUT http://localhost:8080/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated title", "description": "New description", "completed": false}'

# Delete a task (returns 204 No Content)
curl -X DELETE http://localhost:8080/todos/1
```

---

## Project structure

```
cmd/server/main.go          — entry point, wires up DB, router, and handlers
internal/database/          — database connection and migrations
internal/models/            — shared data structs (Todo, request types)
internal/repository/        — all SQL queries
internal/handlers/          — HTTP request/response logic
internal/middleware/        — CORS middleware
migrations/                 — raw SQL schema (also applied automatically on startup)
```
