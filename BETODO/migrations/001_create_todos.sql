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
