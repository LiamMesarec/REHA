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
      res.json({ events: rows }).status(200);
    });
  }
);

// @desc    Fetch an event with all of its files
// @route   GET /api/event/:id
// @access  Public
const getEventById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const db = req.app.locals.db;
    const { id } = req.params;

    db.all(
      `SELECT * FROM Events 
       WHERE Events.id = ?`,
      [id],
      (err: any, rows: any) => {
        if (err) {
          return next(err);
        }
        res.json({ events: rows });
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
    const { id } = req.params; // Correctly extract the id from params

    db.all(
      `SELECT 
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
        res.json({ files: rows });
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

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private/Admin
const deleteEvent = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    console.log("deleteEvent called with params:", req.params);
    const dummyNext = next.toString();
    res.json({ message: "deleteEvent called", params: req.params, dummyNext });
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
