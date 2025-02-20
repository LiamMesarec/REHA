const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('test.db');

export function make()
{
    db.serialize(() => {
      db.run('CREATE TABLE IF NOT EXISTS lorem (info TEXT)');
      const stmt = db.prepare('INSERT INTO lorem (info) VALUES (?)');

      for (let i = 0; i < 10; i++) {
        stmt.run(`Ipsum ${i}`);
      }

      stmt.finalize();

      db.each('SELECT rowid AS id, info FROM lorem', (err: any, row: any) => {
        if (err) {
          console.error(err.message);
        } else {
          console.log(`${row.id}: ${row.info}`);
        }
      });
    });

    db.close((err: any) => {
      if (err) {
        console.error(err.message);
      }
    });
}

