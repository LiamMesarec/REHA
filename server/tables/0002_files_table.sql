-- migrations/2024XXXXXX_create_files_table.sql

-- Up migration
CREATE TABLE IF NOT EXISTS Files (
    id INTEGER PRIMARY KEY,
    name VARCHAR NOT NULL,
    path VARCHAR NOT NULL,
    date_uploaded TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
);

CREATE UNIQUE INDEX files_id ON Files (id);
