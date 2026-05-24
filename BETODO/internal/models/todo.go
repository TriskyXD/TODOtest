package models

import "time"

// Todo is the main data type returned in all API responses.
type Todo struct {
	ID          int64     `json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Completed   bool      `json:"completed"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// CreateTodoRequest is the body expected by POST /todos.
type CreateTodoRequest struct {
	Title       string `json:"title"`
	Description string `json:"description"`
}

// UpdateTodoRequest is the body expected by PUT /todos/{id}.
type UpdateTodoRequest struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Completed   bool   `json:"completed"`
}

// CompleteTodoRequest is the body expected by PATCH /todos/{id}/complete.
type CompleteTodoRequest struct {
	Completed bool `json:"completed"`
}
