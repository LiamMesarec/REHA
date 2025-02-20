-- migrations/2024XXXXXX_create_events_table.sql

-- Up migration
CREATE TABLE IF NOT EXISTS Events (
    id INTEGER PRIMARY KEY,
    title VARCHAR NOT NULL,
    coordinator VARCHAR,
    description VARCHAR NOT NULL,

);

CREATE UNIQUE INDEX event_id ON Events (id);
