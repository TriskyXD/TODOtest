# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Monorepo structure

```
TODOtest/
├── BETODO/   ← Go backend (REST API + MS SQL)
└── FETODO/   ← React frontend (Vite + Tailwind + Untitled UI)
```

---

## BETODO — Go backend

### Commands

```bash
cd BETODO

# Start the database (MS SQL in Docker)
docker compose up -d

# Install / update dependencies
go mod tidy

# Run the server (auto-migrates on startup)
go run ./cmd/server

# Build a binary
go build -o todo-server ./cmd/server
```

### Architecture

**Request flow:** `HTTP → chi router → handler → repository → *sql.DB → MS SQL`

- **`cmd/server/main.go`** — entry point. Loads `.env`, connects to DB, runs migrations, registers routes.
- **`internal/database/`** — opens the SQL Server connection (with retry loop for Docker startup delay), creates the app database if missing, runs the schema migration on startup.
- **`internal/models/`** — plain Go structs shared across layers: `Todo`, `CreateTodoRequest`, `UpdateTodoRequest`, `CompleteTodoRequest`.
- **`internal/repository/`** — all SQL lives here. `ErrNotFound` is returned when an ID does not exist; handlers map it to 404.
- **`internal/handlers/`** — decodes JSON bodies, validates required fields, calls the repository, writes JSON via `respondJSON` / `respondError`.
- **`internal/middleware/cors.go`** — CORS headers and OPTIONS preflight.

### MS SQL specifics

- `IDENTITY(1,1)` — auto-increment PK (like `SERIAL` in Postgres).
- `OUTPUT INSERTED.id` — returns the generated ID from an INSERT.
- Named parameters use `@paramName` syntax; pass them as `sql.Named("paramName", value)`.
- `BIT` → Go `bool`, `DATETIME2` → Go `time.Time`.

### Environment variables (`BETODO/.env`)

| Variable      | Default                | Purpose                              |
|---------------|------------------------|--------------------------------------|
| `DB_HOST`     | `localhost`            | SQL Server host                      |
| `DB_PORT`     | `1433`                 | SQL Server port                      |
| `DB_USER`     | `sa`                   | Database user                        |
| `DB_PASSWORD` | `YourStrong!Passw0rd`  | Must match `SA_PASSWORD` in compose  |
| `DB_NAME`     | `tododb`               | App database (created automatically) |
| `SERVER_PORT` | `8080`                 | HTTP port                            |

---

## FETODO — React frontend

### Commands

```bash
cd FETODO

npm install        # first time only
npm run dev        # dev server on http://localhost:3000
npm run build      # production build → dist/
npm run preview    # preview production build
```

### Architecture

- **Vite 5** + **React 18** + **TypeScript** (strict mode)
- **Tailwind CSS 3** with Untitled UI design tokens baked into `tailwind.config.js`
- **`@untitled-ui/icons-react`** for all icons
- `src/types/todo.ts` — shared `Todo`, `CreateTodoInput`, `UpdateTodoInput` interfaces
- `src/services/api.ts` — typed fetch wrapper; all backend calls go through `api.*`
- `src/components/` — `TodoItem.tsx`, `TodoForm.tsx`
- `src/App.tsx` — state, filtering, and layout

### Proxy

In dev, `vite.config.ts` proxies `/todos` → `http://localhost:8080` so the frontend
can call `fetch('/todos')` directly without CORS issues.

For production set `VITE_API_URL=https://your-backend` in `FETODO/.env`.
