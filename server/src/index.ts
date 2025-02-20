import express, { Request, Response } from "express";
import * as DB from './db';

DB.create_tables_if_not_exists();

const app = express();

app.get("/", (_: Request, res: Response) => {
 res.send("Helloo World!");
});

app.listen(3000);
DB.close();
