import { connectDB, closeDB, runMigrations, dropTables } from "./database/db";
import { testSeedDatabase } from "./database/seeder";
import { App } from './app'

const db = connectDB("./test.db");
dropTables(db);
runMigrations(db);
testSeedDatabase(db);

const app = App(db);
app.listen(3000);

process.on("SIGINT", () => {
  closeDB(db);
  process.exit();
});

process.on("SIGTERM", () => {
  closeDB(db);
  process.exit();
});


