import express, { Request, Response } from "express";
import * as DB from "./db";
import { testSeedDatabase } from "./seed";

const db = DB.createDB("test.db");

DB.create_tables_if_not_exists(db);
testSeedDatabase(db);

const app = express();

app.get("/", (_: Request, res: Response) => {
  res.send("Helloo World!");
});

app.listen(3000);
DB.close(db);
