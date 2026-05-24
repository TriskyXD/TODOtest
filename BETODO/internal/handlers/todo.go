package handlers

import (
	"encoding/json"
	"errors"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"

	"todoapp/internal/models"
	"todoapp/internal/repository"
)

type TodoHandler struct {
	repo repository.TodoRepository
}

func NewTodoHandler(repo repository.TodoRepository) *TodoHandler {
	return &TodoHandler{repo: repo}
}

// GET /todos
func (h *TodoHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	todos, err := h.repo.GetAll()
	if err != nil {
		respondError(w, http.StatusInternalServerError, "failed to fetch todos")
		return
	}
	respondJSON(w, http.StatusOK, todos)
}

// GET /todos/{id}
func (h *TodoHandler) GetOne(w http.ResponseWriter, r *http.Request) {
	id, err := parseID(r)
	if err != nil {
		respondError(w, http.StatusBadRequest, "id must be a number")
		return
	}

	todo, err := h.repo.GetByID(id)
	if errors.Is(err, repository.ErrNotFound) {
		respondError(w, http.StatusNotFound, "todo not found")
		return
	}
	if err != nil {
		respondError(w, http.StatusInternalServerError, "failed to fetch todo")
		return
	}
	respondJSON(w, http.StatusOK, todo)
}

// POST /todos
func (h *TodoHandler) Create(w http.ResponseWriter, r *http.Request) {
	var req models.CreateTodoRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondError(w, http.StatusBadRequest, "invalid request body")
		return
	}
	if req.Title == "" {
		respondError(w, http.StatusBadRequest, "title is required")
		return
	}

	todo, err := h.repo.Create(req)
	if err != nil {
		respondError(w, http.StatusInternalServerError, "failed to create todo")
		return
	}
	respondJSON(w, http.StatusCreated, todo)
}

// PUT /todos/{id}
func (h *TodoHandler) Update(w http.ResponseWriter, r *http.Request) {
	id, err := parseID(r)
	if err != nil {
		respondError(w, http.StatusBadRequest, "id must be a number")
		return
	}

	var req models.UpdateTodoRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondError(w, http.StatusBadRequest, "invalid request body")
		return
	}
	if req.Title == "" {
		respondError(w, http.StatusBadRequest, "title is required")
		return
	}

	todo, err := h.repo.Update(id, req)
	if errors.Is(err, repository.ErrNotFound) {
		respondError(w, http.StatusNotFound, "todo not found")
		return
	}
	if err != nil {
		respondError(w, http.StatusInternalServerError, "failed to update todo")
		return
	}
	respondJSON(w, http.StatusOK, todo)
}

// PATCH /todos/{id}/complete
func (h *TodoHandler) Complete(w http.ResponseWriter, r *http.Request) {
	id, err := parseID(r)
	if err != nil {
		respondError(w, http.StatusBadRequest, "id must be a number")
		return
	}

	var req models.CompleteTodoRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	todo, err := h.repo.SetCompleted(id, req.Completed)
	if errors.Is(err, repository.ErrNotFound) {
		respondError(w, http.StatusNotFound, "todo not found")
		return
	}
	if err != nil {
		respondError(w, http.StatusInternalServerError, "failed to update todo")
		return
	}
	respondJSON(w, http.StatusOK, todo)
}

// DELETE /todos/{id}
func (h *TodoHandler) Delete(w http.ResponseWriter, r *http.Request) {
	id, err := parseID(r)
	if err != nil {
		respondError(w, http.StatusBadRequest, "id must be a number")
		return
	}

	err = h.repo.Delete(id)
	if errors.Is(err, repository.ErrNotFound) {
		respondError(w, http.StatusNotFound, "todo not found")
		return
	}
	if err != nil {
		respondError(w, http.StatusInternalServerError, "failed to delete todo")
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

// parseID extracts the {id} path parameter and converts it to int64.
func parseID(r *http.Request) (int64, error) {
	return strconv.ParseInt(chi.URLParam(r, "id"), 10, 64)
}

func respondJSON(w http.ResponseWriter, status int, data any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(data)
}

func respondError(w http.ResponseWriter, status int, message string) {
	respondJSON(w, status, map[string]string{"error": message})
}
