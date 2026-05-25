package database

import (
	"database/sql"
	"fmt"
	"log"
	"net/url"
	"time"

	_ "github.com/microsoft/go-mssqldb"
)

// Connect opens a connection to SQL Server, creates the app database if missing,
// and returns a ready-to-use *sql.DB.
func Connect(host, port, user, password, dbName string) (*sql.DB, error) {
	q := url.Values{}
	q.Set("database", "master")
	q.Set("TrustServerCertificate", "true")
	masterDSN := fmt.Sprintf("sqlserver://%s:%s@%s:%s?%s",
		url.PathEscape(user), url.PathEscape(password), host, port, q.Encode())

	// MSSQL in Docker takes ~20s to initialise, so we retry before giving up.
	var masterDB *sql.DB
	var pingErr error
	for i := 0; i < 10; i++ {
		var err error
		masterDB, err = sql.Open("sqlserver", masterDSN)
		if err != nil {
			return nil, fmt.Errorf("open connection: %w", err)
		}

		pingErr = masterDB.Ping()
		if pingErr == nil {
			break
		}

		masterDB.Close()
		log.Printf("Database not ready, retrying in 3s... (%d/10)", i+1)
		time.Sleep(3 * time.Second)
	}
	if pingErr != nil {
		return nil, fmt.Errorf("could not connect after 10 attempts: %w", pingErr)
	}
	defer masterDB.Close()

	// Create the app database if it does not exist yet.
	_, err := masterDB.Exec(fmt.Sprintf(
		"IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = '%s') CREATE DATABASE [%s]",
		dbName, dbName,
	))
	if err != nil {
		return nil, fmt.Errorf("create database: %w", err)
	}

	q2 := url.Values{}
	q2.Set("database", dbName)
	q2.Set("TrustServerCertificate", "true")
	dsn := fmt.Sprintf("sqlserver://%s:%s@%s:%s?%s",
		url.PathEscape(user), url.PathEscape(password), host, port, q2.Encode())
	db, err := sql.Open("sqlserver", dsn)
	if err != nil {
		return nil, fmt.Errorf("open app database: %w", err)
	}

	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("ping app database: %w", err)
	}

	log.Printf("Connected to database '%s'", dbName)
	return db, nil
}

// migrationSQL is applied once on startup; the IF NOT EXISTS guard makes it safe to re-run.
const migrationSQL = `
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name = 'todos' AND xtype = 'U')
BEGIN
	CREATE TABLE todos (
		id          BIGINT        IDENTITY(1,1) PRIMARY KEY,
		title       NVARCHAR(255) NOT NULL,
		description NVARCHAR(MAX) NOT NULL DEFAULT '',
		completed   BIT           NOT NULL DEFAULT 0,
		created_at  DATETIME2     NOT NULL DEFAULT GETUTCDATE(),
		updated_at  DATETIME2     NOT NULL DEFAULT GETUTCDATE()
	)
END
`

func RunMigrations(db *sql.DB) error {
	if _, err := db.Exec(migrationSQL); err != nil {
		return fmt.Errorf("migration error: %w", err)
	}
	log.Println("Migrations applied successfully")
	return nil
}
