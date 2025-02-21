import express from "express";
import {
  createEvent,
  deleteEvent,
  getEventById,
  getEvents,
  updateEvent,
  getFilesByEventId,
} from "../controllers/eventController";

const router = express.Router();

router.route("/").get(getEvents).post(createEvent);

router.route("/:id").get(getEventById).put(updateEvent).delete(deleteEvent);
router.route("/:id/files").get(getFilesByEventId);
export default router;
