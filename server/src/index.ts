import { connectDB, closeDB, runMigrations } from './database/db';
import { App } from './app';

const db = connectDB('./production.db');
runMigrations(db);

const app = App(db);
app.listen(3000);

process.on('SIGINT', () => {
  closeDB(db);
  process.exit();
});

process.on('SIGTERM', () => {
  closeDB(db);
  process.exit();
});
