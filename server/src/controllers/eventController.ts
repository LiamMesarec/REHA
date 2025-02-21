import { Request, Response, NextFunction } from "express";
import asyncHandler from "../middleware/asyncHandler";

// @desc    Fetch all events
// @route   GET /api/events
// @access  Public
const getEvents = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    console.log("getEvents called with query:", req.query);
    const dummyNext = next.toString();
    res.json({ message: "getEvents called", query: req.query, dummyNext });
  }
);

// @desc    Fetch an event
// @route   GET /api/event/:id
// @access  Public
const getEventById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    console.log("getEventById called with params:", req.params);
    const dummyNext = next.toString();
    res.json({ message: "getEventById called", params: req.params, dummyNext });
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

export { getEvents, getEventById, createEvent, updateEvent, deleteEvent };
