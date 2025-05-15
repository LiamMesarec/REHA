import express from 'express';
import {
  createEvent,
  deleteEvent,
  getEventById,
  getEvents,
  updateEvent,
  getFilesByEventId,
  attachFileToEvent,
  unlinkFileFromEvent,
} from '../controllers/eventController';
import { authHandler } from '../middleware/authHandler';

const router = express.Router();

router.route('/').get(getEvents).post(authHandler, createEvent);

router
  .route('/:id')
  .get(getEventById)
  .put(authHandler, updateEvent)
  .delete(authHandler, deleteEvent);

router.route('/:id/files').get(getFilesByEventId).post(authHandler, attachFileToEvent).delete(authHandler, unlinkFileFromEvent);

export default router;
