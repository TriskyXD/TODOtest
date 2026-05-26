# TODOtest

A full-stack TODO application — Go REST API backend + React frontend.

> **Vibecoded project** — built by someone learning as they go, with the help of AI.
> Not production-ready, but a great starting point for exploring Go + React + Figma-driven development.

## Docs

- [Using AI to code from a Figma design](docs/figma-ai-coding-intro.md) — how to use Claude + Figma MCP to generate React components
- [App development PRD guide](docs/figma-ai-coding-principle.md) — template for planning any app before you start coding
- [Do you need Storybook?](docs/do-you-need-storybook.md) — when you need Storybook and when Untitled UI is enough
- [Testing & code review](docs/testing-review.md) — Playwright, `/review` and custom audit rules explained

---

## Monorepo structure

A monorepo keeps both the backend and frontend in one place, so you always have a single source of truth — no juggling multiple repositories, branches, or versions when making changes that touch both sides. It also makes it easy to share types, configs, and scripts across projects without publishing packages or dealing with dependency hell.

```
TODOtest/
├── BETODO/   ← Go backend (REST API + MS SQL)
├── FETODO/   ← React frontend (Vite + Tailwind + Untitled UI)
└── docs/     ← Guides and documentation
```

---

## Backend (BETODO)

### Requirements

- [Go 1.23+](https://go.dev/dl/)
- [Docker](https://www.docker.com/) with Docker Compose

### Running the backend

**1. Install Go dependencies**
```bash
cd BETODO
go mod tidy
```

**2. Set up environment variables**
```bash
cp .env.example .env
```
The defaults in `.env.example` work out of the box for local development — no changes needed.

**3. Start MS SQL in Docker**
```bash
docker compose up -d
```
The first startup takes about 20–30 seconds while SQL Server initialises.
The Go app retries automatically, so you can start both together.

**4. Start the server**
```bash
go run ./cmd/server
```

On startup the app will:
1. Connect to SQL Server
2. Create the `tododb` database if it does not exist
3. Create the `todos` table if it does not exist
4. Start listening on `http://localhost:8080`

### Project structure

```
cmd/server/main.go       — entry point, wires up DB, router, and handlers
internal/database/       — database connection and migrations
internal/models/         — shared data structs (Todo, request types)
internal/repository/     — all SQL queries
internal/handlers/       — HTTP request/response logic
internal/middleware/     — CORS middleware
```

### API Reference

All endpoints accept and return `application/json`.

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/todos` | List all tasks |
| `GET` | `/todos/{id}` | Get one task |
| `POST` | `/todos` | Create a task |
| `PUT` | `/todos/{id}` | Replace a task |
| `PATCH` | `/todos/{id}/complete` | Toggle completed status |
| `DELETE` | `/todos/{id}` | Delete a task |

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

### Example requests

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

# Update a task
curl -X PUT http://localhost:8080/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated title", "description": "New description", "completed": false}'

# Delete a task (returns 204 No Content)
curl -X DELETE http://localhost:8080/todos/1
```

---

## Frontend (FETODO)

### Requirements

- [Node.js 18+](https://nodejs.org/)

### Running the frontend

```bash
cd FETODO
npm install       # first time only
npm run dev       # dev server on http://localhost:3000
```

Other commands:
```bash
npm run build     # production build → dist/
npm run preview   # preview the production build
```

### Project structure

```
src/
├── components/       — TodoItem.tsx, TodoForm.tsx
├── services/api.ts   — typed fetch wrapper for all backend calls
├── types/todo.ts     — shared Todo, CreateTodoInput, UpdateTodoInput interfaces
└── App.tsx           — state, filtering, and layout
```

### Dev proxy

In development, Vite proxies `/todos` → `http://localhost:8080` so the frontend
calls the backend directly without CORS issues.

For production, set `VITE_API_URL=https://your-backend` in `FETODO/.env`.
