import express, { Request, Response } from "express";
import { connectDB, closeDB, runMigrations, dropTables } from "./database/db";
import { testSeedDatabase } from "./database/seeder";
import eventRoutes from "./routes/eventRoutes";
const db = connectDB("./test.db");

dropTables(db);

runMigrations(db);

testSeedDatabase(db);

const app = express();

app.get("/", (_: Request, res: Response) => {
  res.send("Hello World!");
});

app.use("/api/events", eventRoutes);

process.on("SIGINT", () => {
  closeDB(db);
  process.exit();
});

app.listen(3000);
