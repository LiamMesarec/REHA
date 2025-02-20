import express, { Request, Response } from "express";
import * as DB from './db';

DB.make();
const app = express();

app.get("/", (_: Request, res: Response) => {
 res.send("Helloo World!");
});

app.listen(3000);
