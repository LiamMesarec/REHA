-- migrations/2024XXXXXX_create_event_files_table.sql

-- Up migration
CREATE TABLE IF NOT EXISTS EventFiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id INTEGER NOT NULL,
    file_id INTEGER NOT NULL,

    FOREIGN KEY (event_id) REFERENCES Events (id) ON DELETE CASCADE,
    FOREIGN KEY (file_id) REFERENCES Files (id) ON DELETE CASCADE,

    UNIQUE (event_id, file_id)
);

CREATE INDEX idx_event_id ON EventFiles (event_id);
CREATE INDEX idx_file_id ON EventFiles (file_id);
