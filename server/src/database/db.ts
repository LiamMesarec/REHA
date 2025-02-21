import { Database } from "sqlite3";
const sqlite3 = require("sqlite3").verbose();

export function connectDB(path: string): Database {
  const db = new sqlite3.Database(path, (err: any) => {
    if (err) {
      console.error("Error connecting to database:", err.message);
    } else {
      console.log(`Connected to database: ${path}`);
    }
  });
  return db;
}

export function runMigrations(db: Database): void {
  db.serialize(() => {
    db.run(
      `CREATE TABLE IF NOT EXISTS Events (
         id INTEGER PRIMARY KEY,
         title VARCHAR NOT NULL,
         coordinator VARCHAR,
         description VARCHAR NOT NULL
       );
       CREATE UNIQUE INDEX IF NOT EXISTS event_id ON Events (id);`
    );

    db.run(
      `CREATE TABLE IF NOT EXISTS Files (
         id INTEGER PRIMARY KEY,
         name VARCHAR NOT NULL,
         path VARCHAR NOT NULL,
         date_uploaded TIMESTAMP DEFAULT CURRENT_TIMESTAMP
       );
       CREATE UNIQUE INDEX IF NOT EXISTS files_id ON Files (id);`
    );

    db.run(
      `CREATE TABLE IF NOT EXISTS EventFiles (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         event_id INTEGER NOT NULL,
         file_id INTEGER NOT NULL,
         FOREIGN KEY (event_id) REFERENCES Events (id) ON DELETE CASCADE,
         FOREIGN KEY (file_id) REFERENCES Files (id) ON DELETE CASCADE,
         UNIQUE (event_id, file_id)
       );
       CREATE INDEX IF NOT EXISTS idx_event_id ON EventFiles (event_id);
       CREATE INDEX IF NOT EXISTS idx_file_id ON EventFiles (file_id);`
    );
    console.log("Migrations completed.");
  });
}

export function dropTables(db: Database): void {
  db.serialize(() => {
    db.run(`DROP TABLE IF EXISTS EventFiles;`, (err: any) => {
      if (err) {
        console.error("Error dropping EventFiles:", err.message);
      } else {
        console.log("Dropped EventFiles table.");
      }
    });

    db.run(`DROP TABLE IF EXISTS Events;`, (err: any) => {
      if (err) {
        console.error("Error dropping Events:", err.message);
      } else {
        console.log("Dropped Events table.");
      }
    });

    db.run(`DROP TABLE IF EXISTS Files;`, (err: any) => {
      if (err) {
        console.error("Error dropping Files:", err.message);
      } else {
        console.log("Dropped Files table.");
      }
    });
  });
}

export function closeDB(db: Database): void {
  db.close((err: any) => {
    if (err) {
      console.error("Error closing database:", err.message);
    } else {
      console.log("Database connection closed.");
    }
  });
}
