import express from "express";
import {Database} from "sqlite3";
import eventRoutes from "./routes/eventRoutes";
import fileRoutes from "./routes/fileRoutes";
import { notFound } from "./middleware/errorHandler";
import { errorHandler } from "./middleware/errorHandler";

export function App(db: Database): express.Application {
    const app = express();
    app.use(express.json());
    app.locals.db = db;

    app.use("/api/events", eventRoutes);
    app.use("/api/files", fileRoutes);

    app.use(notFound);
    app.use(errorHandler);

    return app;
}
