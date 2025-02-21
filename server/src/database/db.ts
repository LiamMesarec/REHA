import { Database } from "sqlite3";
const sqlite3 = require("sqlite3").verbose();
import fs from 'fs';
import path from 'path';

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
    const tablesDir = path.join(__dirname, 'tables');
  const files = fs.readdirSync(tablesDir).filter(file => file.endsWith('.sql'));
  db.serialize(() => {
    files.forEach(file => {
      const filePath = path.join(tablesDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');

      db.run(sql, (err) => {
        if (err) {
          console.error(`Error creating table from ${file}:`, err.message);
        } else {
          console.log(`Created table from ${file}.`);
        }
      });
    })
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

    db.run(`DROP TABLE IF EXISTS RepeatableEvents;`, (err: any) => {
      if (err) {
        console.error("Error dropping RepeatableEvents:", err.message);
      } else {
        console.log("Dropped RepeatableEvents table.");
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
