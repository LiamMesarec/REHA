import { Database } from 'sqlite3';
const sqlite3 = require('sqlite3').verbose();
import fs from 'fs';
import path from 'path';

export function connectDB(path: string): Database {
  const db = new sqlite3.Database(path, (err: any) => {
    if (err) {
      console.error('Error connecting to database:', err.message);
    }
  });
  return db;
}


export function runMigrations(db: Database): void {
  const tablesDir = path.join(__dirname, 'tables');
  const files = fs.readdirSync(tablesDir).filter((file) => file.endsWith('.sql'));
  db.serialize(() => {
    files.forEach((file) => {
      const filePath = path.join(tablesDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');

      db.run(sql, (err) => {
        if (err) {
          console.error(`Error creating table from ${file}:`, err.message);
        }
      });
    });
  });
}

export function dropTables(db: Database): void {
  db.serialize(() => {
    db.run(`DROP TABLE IF EXISTS EventFiles;`, (err: any) => {
      if (err) {
        console.error('Error dropping EventFiles:', err.message);
      }
    });

    db.run(`DROP TABLE IF EXISTS RepeatableEvents;`, (err: any) => {
      if (err) {
        console.error('Error dropping RepeatableEvents:', err.message);
      }
    });

    db.run(`DROP TABLE IF EXISTS Events;`, (err: any) => {
      if (err) {
        console.error('Error dropping Events:', err.message);
      }
    });

    db.run(`DROP TABLE IF EXISTS Files;`, (err: any) => {
      if (err) {
        console.error('Error dropping Files:', err.message);
      }
    });
  });
}

export function closeDB(db: Database): void {
  db.close((err: any) => {
    if (err) {
      console.error('Error closing database:', err.message);
    }
  });
}


export function addLocationColumn(db: Database): void {
  db.serialize(() => {
    db.run(`ALTER TABLE Events ADD COLUMN location TEXT`, (err: any) => {
      if (err) {
        console.error('Error adding location column:', err.message);
      } else {
        console.log('Location column added successfully.');
      }
    });
  });
}

export function addBranchColumnToEvent(db: Database): void {
  db.serialize(() => {
    db.run(`ALTER TABLE Events ADD COLUMN branch TEXT DEFAULT 'FZSV'`, (err: any) => {
      if (err) {
        console.error('Error adding branch column:', err.message);
      } else {
        console.log('Branch column added successfully.');
      }
    });
  });
}

export function addBranchColumnToFiles(db: Database): void {
  db.serialize(() => {
    db.run(`ALTER TABLE Files ADD COLUMN branch TEXT DEFAULT 'FZSV'`, (err: any) => {
      if (err) {
        console.error('Error adding branch column to Files:', err.message);
      } else {
        console.log('Branch column added to Files successfully.');
      }
    });
  });
}