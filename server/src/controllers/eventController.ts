import { Request, Response, NextFunction } from "express";
import asyncHandler from "../middleware/asyncHandler";

// @desc    Fetch all events
// @route   GET /api/events
// @access  Public
const getEvents = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const db = req.app.locals.db;
    db.all("SELECT * FROM Events", [], (err: any, rows: any) => {
      if (err) {
        return next(err);
      }
      res.status(200).json({ events: rows });
    });
  }
);

// @desc    Fetch an event information
// @route   GET /api/event/:id
// @access  Public
const getEventById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const db = req.app.locals.db;
    const { id } = req.params;

    db.get(
      `SELECT 
        Events.id,
        Events.title,
        Events.coordinator,
        Events.description,
        Events.start,
        RepeatableEvents.from_date,
        RepeatableEvents.to_date
      FROM Events  
       LEFT JOIN RepeatableEvents ON Events.id = RepeatableEvents.event_id
       WHERE Events.id = ?`,
      [id],
      (err: any, row: any) => {
        if (err) {
          return next(err);
        }

        if (!row) {
          return res.status(404).json({ message: "Event not found" });
        }

        res.status(200).json({ event: row });
      }
    );
  }
);

// @desc    Fetch all files of an event
// @route   GET /api/event/:id/files
// @access  Public
const getFilesByEventId = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const db = req.app.locals.db;
    const { id } = req.params;

    db.all(
      `SELECT 
        Files.id,
        Files.path,
        Files.name
      FROM Files 
       LEFT JOIN EventFiles ON Files.id = EventFiles.file_id
       WHERE EventFiles.event_id = ?`,
      [id],
      (err: any, rows: any) => {
        if (err) {
          return next(err);
        }

        if (!rows || rows.length === 0) {
          return res
            .status(404)
            .json({ message: "Files attached to the Event not found!" });
        }

        res.status(200).json({ files: rows });
      }
    );
  }
);

// @desc    Create an event
// @route   POST /api/events
// @access  Private/Admin
const createEvent = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    console.log("createEvent called with body:", req.body);
    const dummyNext = next.toString();
    res.json({ message: "createEvent called", body: req.body, dummyNext });
  }
);

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private/Admin
const updateEvent = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    console.log(
      "updateEvent called with params and body:",
      req.params,
      req.body
    );
    const dummyNext = next.toString();
    res.json({
      message: "updateEvent called",
      params: req.params,
      body: req.body,
      dummyNext,
    });
  }
);

// @desc    Delete an event with all of its appended files
// @route   DELETE /api/events/:id
// @access  Public
const deleteEvent = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const db = req.app.locals.db;
    const { id } = req.params;

    db.get(
      "SELECT id FROM Events WHERE id = ?",
      [id],
      function (err: any, row: any) {
        if (err) {
          return next(err);
        }
        if (!row) {
          return res.status(404).json({ message: "Event not found!" });
        }
      }
    );

    db.run(
      "DELETE FROM Files WHERE id IN (SELECT file_id FROM EventFiles WHERE event_id = ?)",
      [id],
      (err: any) => {
        if (err) {
          return next(err);
        }

        db.run("DELETE FROM Events WHERE id = ?", [id], (err: any) => {
          if (err) {
            return next(err);
          }

          res.status(200).json({
            message: "Event and its attached files are deleted successfully.",
          });
        });
      }
    );
  }
);

export {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getFilesByEventId,
};
