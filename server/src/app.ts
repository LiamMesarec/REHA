import express from 'express';
import cors from 'cors';
import { Database } from 'sqlite3';
import eventRoutes from './routes/eventRoutes';
import fileRoutes from './routes/fileRoutes';
import users from './routes/users';
import login from './routes/login';
import { notFound } from './middleware/errorHandler';
import { errorHandler } from './middleware/errorHandler';
import { authHandler } from './middleware/authHandler';
import { addLocationColumn } from './database/db';

export function App(db: Database): express.Application {
  const app = express();
  app.use(cors());
   // Limit JSON bodies to ~1 GiB
  app.use(express.json({ limit: '1024mb' }));
  // Limit URL-encoded bodies (form data) to ~1 GiB
  app.use(express.urlencoded({ limit: '1024mb', extended: true }));
  // Catch any other raw payloads up to ~1 GiB
   // Only raw-parse non-multipart bodies
  // app.use(express.raw({
  //   limit: '1024mb',
  //   type: (req) => {
  //     const ct = req.headers['content-type'] || '';
  //     return ct.startsWith('application/') && !ct.startsWith('multipart/');
  //   }
  // }));
  app.locals.db = db;

  app.use('/api/events', eventRoutes);
  app.use('/api/files', fileRoutes);
  app.use('/api/users', users);
  app.use('/api/login', login);

  app.use(authHandler);
  app.use(notFound);
  app.use(errorHandler);

  return app;
}