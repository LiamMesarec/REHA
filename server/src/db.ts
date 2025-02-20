const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('test.db');

export function close()
{
    db.close((err: any) => {
      if (err) {
        console.error(err.message);
      }
    });
}
export function create_tables_if_not_exists()
{
    db.serialize(() => {
      db.run(`CREATE TABLE IF NOT EXISTS Events (
    id INTEGER PRIMARY KEY,
    title VARCHAR NOT NULL,
    coordinator VARCHAR,
    description VARCHAR NOT NULL

);

CREATE UNIQUE INDEX event_id ON Events (id);
`);

    db.run(`CREATE TABLE IF NOT EXISTS Files (
    id INTEGER PRIMARY KEY,
    name VARCHAR NOT NULL,
    path VARCHAR NOT NULL,
    date_uploaded TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX files_id ON Files (id);
    `);

    db.run(`CREATE TABLE IF NOT EXISTS EventFiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id INTEGER NOT NULL,
    file_id INTEGER NOT NULL,

    FOREIGN KEY (event_id) REFERENCES Events (id) ON DELETE CASCADE,
    FOREIGN KEY (file_id) REFERENCES Files (id) ON DELETE CASCADE,

    UNIQUE (event_id, file_id)
);

CREATE INDEX idx_event_id ON EventFiles (event_id);
CREATE INDEX idx_file_id ON EventFiles (file_id);
`);
    });


}

