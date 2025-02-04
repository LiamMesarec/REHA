import express, { Request, Response } from "express";

const app = express();

app.get("/", (_: Request, res: Response) => {
 res.send("Helloo World!");
});

app.listen(3000);
