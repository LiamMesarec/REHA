import { Request, Response, NextFunction } from "express";
import asyncHandler from "../middleware/asyncHandler";

// @desc    Fetch all files
// @route   GET /api/files
// @access  Public
const getFiles = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const db = req.app.locals.db;
    db.all("SELECT * FROM Files", [], (err: any, rows: any) => {
      if (err) {
        return next(err);
      }
      res.json({ events: rows }).status(200);
    });
  }
);

// @desc    Fetch a file by id
// @route   GET /api/files/:id
// @access  Public
const getFileById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const db = req.app.locals.db;
    const { id } = req.params;

    db.all(
      `SELECT * FROM Files
       WHERE Files.id = ?`,
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

// @desc    Create a file
// @route   POST /api/files
// @access  Private/Admin
const createFile = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const db = req.app.locals.db;
    const { name, path } = req.body;

    if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }

    if (!name || !path) {
      res.status(400).json({ message: "Name and path are required" });
      return;
    }

    const query = `INSERT INTO Files (name, path) VALUES (?, ?)`;
    db.run(query, [name, path], function (err: any) {
      if (err) {
        return next(err);
      }
      res.status(201).json({ id: this.lastID, name, path, date_uploaded: new Date() });
    });
  }
);

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private/Admin
const deleteFile = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    console.log("deleteFile called with params:", req.params);
    const dummyNext = next.toString();
    res.json({ message: "deleteFile called", params: req.params, dummyNext });
  }
);

export {
    createFile,
  getFiles,
  getFileById,
  deleteFile,
};
