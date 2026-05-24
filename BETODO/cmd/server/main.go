package main

import (
	"log"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/joho/godotenv"

	"todoapp/internal/database"
	"todoapp/internal/handlers"
	appMiddleware "todoapp/internal/middleware"
	"todoapp/internal/repository"
)

func main() {
	// Load .env file if it exists. Falls back to real environment variables (e.g. in Docker).
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, reading from environment variables")
	}

	db, err := database.Connect(
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
	)
	if err != nil {
		log.Fatalf("Database connection failed: %v", err)
	}
	defer db.Close()

	if err := database.RunMigrations(db); err != nil {
		log.Fatalf("Migration failed: %v", err)
	}

	todoRepo := repository.NewTodoRepository(db)
	todoHandler := handlers.NewTodoHandler(todoRepo)

	r := chi.NewRouter()
	r.Use(middleware.Logger)    // logs every request with method, path, status, duration
	r.Use(middleware.Recoverer) // recovers from panics and returns 500 instead of crashing
	r.Use(appMiddleware.CORS)

	r.Route("/todos", func(r chi.Router) {
		r.Get("/", todoHandler.GetAll)
		r.Post("/", todoHandler.Create)
		r.Get("/{id}", todoHandler.GetOne)
		r.Put("/{id}", todoHandler.Update)
		r.Patch("/{id}/complete", todoHandler.Complete)
		r.Delete("/{id}", todoHandler.Delete)
	})

	port := os.Getenv("SERVER_PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server running on http://localhost:%s", port)
	if err := http.ListenAndServe(":"+port, r); err != nil {
		log.Fatalf("Server error: %v", err)
	}
}
