import express, { Request, Response } from "express";
import { connectDB, closeDB, runMigrations, dropTables } from "./database/db";
import { testSeedDatabase } from "./database/seeder";
import eventRoutes from "./routes/eventRoutes";
import fileRoutes from "./routes/fileRoutes";

const db = connectDB("./test.db");

dropTables(db);

runMigrations(db);

testSeedDatabase(db);

const app = express();

app.locals.db = db;

app.get("/", (_: Request, res: Response) => {
  res.send("");
});

app.use("/api/events", eventRoutes);
app.use("/api/files", fileRoutes);

process.on("SIGINT", () => {
  closeDB(db);
  process.exit();
});

app.listen(3000);
