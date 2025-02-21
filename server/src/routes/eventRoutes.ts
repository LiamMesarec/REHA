import express from "express";
import {
  createEvent,
  deleteEvent,
  getEventById,
  getEvents,
  updateEvent,
} from "../controllers/eventController";

const router = express.Router();

router.route("/").get(getEvents).post(createEvent);

router.route("/:id").get(getEventById).put(updateEvent).delete(deleteEvent);

export default router;
