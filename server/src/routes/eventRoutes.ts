import express from 'express';
import { authHandler } from '../middleware/authHandler';
import {
  createEvent,
  deleteEvent,
  getEventById,
  getEvents,
  updateEvent,
  getFilesByEventId,
  attachFileToEvent,
} from '../controllers/eventController';

const router = express.Router();

router.route('/').get(getEvents).post(authHandler, createEvent);

router
  .route('/:id')
  .get(getEventById)
  .put(authHandler, updateEvent)
  .delete(authHandler, deleteEvent);

router.route('/:id/files').get(getFilesByEventId).post(authHandler, attachFileToEvent);

export default router;
