package repository

import (
	"database/sql"
	"errors"
	"fmt"
	"time"

	"todoapp/internal/models"
)

// ErrNotFound is returned when a todo with the given ID does not exist.
var ErrNotFound = errors.New("todo not found")

// TodoRepository defines all database operations for todos.
// Using an interface makes it easy to swap the real DB for a fake in tests.
type TodoRepository interface {
	GetAll() ([]models.Todo, error)
	GetByID(id int64) (*models.Todo, error)
	Create(req models.CreateTodoRequest) (*models.Todo, error)
	Update(id int64, req models.UpdateTodoRequest) (*models.Todo, error)
	SetCompleted(id int64, completed bool) (*models.Todo, error)
	Delete(id int64) error
}

type sqlTodoRepository struct {
	db *sql.DB
}

func NewTodoRepository(db *sql.DB) TodoRepository {
	return &sqlTodoRepository{db: db}
}

func (r *sqlTodoRepository) GetAll() ([]models.Todo, error) {
	rows, err := r.db.Query(`
		SELECT id, title, description, completed, created_at, updated_at
		FROM todos
		ORDER BY created_at DESC
	`)
	if err != nil {
		return nil, fmt.Errorf("query todos: %w", err)
	}
	defer rows.Close()

	// Initialise as empty slice so the JSON response is [] instead of null.
	todos := []models.Todo{}
	for rows.Next() {
		var t models.Todo
		if err := rows.Scan(&t.ID, &t.Title, &t.Description, &t.Completed, &t.CreatedAt, &t.UpdatedAt); err != nil {
			return nil, fmt.Errorf("scan todo row: %w", err)
		}
		todos = append(todos, t)
	}
	return todos, nil
}

func (r *sqlTodoRepository) GetByID(id int64) (*models.Todo, error) {
	var t models.Todo
	err := r.db.QueryRow(`
		SELECT id, title, description, completed, created_at, updated_at
		FROM todos
		WHERE id = @id
	`, sql.Named("id", id)).Scan(&t.ID, &t.Title, &t.Description, &t.Completed, &t.CreatedAt, &t.UpdatedAt)

	if errors.Is(err, sql.ErrNoRows) {
		return nil, ErrNotFound
	}
	if err != nil {
		return nil, fmt.Errorf("get todo by id: %w", err)
	}
	return &t, nil
}

func (r *sqlTodoRepository) Create(req models.CreateTodoRequest) (*models.Todo, error) {
	var id int64
	// OUTPUT INSERTED.id returns the auto-generated IDENTITY value in the same statement.
	err := r.db.QueryRow(`
		INSERT INTO todos (title, description)
		OUTPUT INSERTED.id
		VALUES (@title, @description)
	`,
		sql.Named("title", req.Title),
		sql.Named("description", req.Description),
	).Scan(&id)

	if err != nil {
		return nil, fmt.Errorf("create todo: %w", err)
	}
	return r.GetByID(id)
}

func (r *sqlTodoRepository) Update(id int64, req models.UpdateTodoRequest) (*models.Todo, error) {
	result, err := r.db.Exec(`
		UPDATE todos
		SET title       = @title,
		    description = @description,
		    completed   = @completed,
		    updated_at  = @updatedAt
		WHERE id = @id
	`,
		sql.Named("title", req.Title),
		sql.Named("description", req.Description),
		sql.Named("completed", req.Completed),
		sql.Named("updatedAt", time.Now().UTC()),
		sql.Named("id", id),
	)
	if err != nil {
		return nil, fmt.Errorf("update todo: %w", err)
	}

	rows, _ := result.RowsAffected()
	if rows == 0 {
		return nil, ErrNotFound
	}
	return r.GetByID(id)
}

func (r *sqlTodoRepository) SetCompleted(id int64, completed bool) (*models.Todo, error) {
	result, err := r.db.Exec(`
		UPDATE todos
		SET completed  = @completed,
		    updated_at = @updatedAt
		WHERE id = @id
	`,
		sql.Named("completed", completed),
		sql.Named("updatedAt", time.Now().UTC()),
		sql.Named("id", id),
	)
	if err != nil {
		return nil, fmt.Errorf("set completed: %w", err)
	}

	rows, _ := result.RowsAffected()
	if rows == 0 {
		return nil, ErrNotFound
	}
	return r.GetByID(id)
}

func (r *sqlTodoRepository) Delete(id int64) error {
	result, err := r.db.Exec(`DELETE FROM todos WHERE id = @id`, sql.Named("id", id))
	if err != nil {
		return fmt.Errorf("delete todo: %w", err)
	}

	rows, _ := result.RowsAffected()
	if rows == 0 {
		return ErrNotFound
	}
	return nil
}
