import { Request, Response, NextFunction } from 'express';
import asyncHandler from '../middleware/asyncHandler';
import path from 'path';
import fs from 'fs';
import mime from 'mime-types';

// @desc    Fetch all files
// @route   GET /api/files
// @access  Public
const getFiles = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const db = req.app.locals.db;
    db.all('SELECT * FROM Files', [], (err: any, rows: any) => {
      if (err) {
        console.error('GET /api/files error:', err);
        return next(err);
      }
      res.json({ files: rows }).status(200);
    });
  },
);

// @desc    Fetch file information by id
// @route   GET /api/files/:id
// @access  Public
const getFileById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const db = req.app.locals.db;
    const { id } = req.params;

    db.get(`SELECT * FROM Files WHERE id = ?`, [id], (err: any, row: any) => {
      if (err) {
        return next(err);
      }
      if (!row) {
        return res.status(404).json({ message: 'File not found' });
      }
      res.json({ file: row });
    });
  },
);

// @desc    Create a file
// @route   POST /api/files
// @access  Private/Admin
const createFile = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const db = req.app.locals.db;
    const { name, path } = req.body;

    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    if (!name || !path) {
      res.status(400).json({ message: 'Name and path are required' });
      return;
    }

    const query = `INSERT INTO Files (name, path, uuid) VALUES (?, ?, ?)`;
    db.run(query, [name, path, req.file.filename], function (err: any) {
      if (err) {
        return next(err);
      }
      res
        .status(201)
        .json({ id: this.lastID, name, path, uuid: req.file?.filename, date_uploaded: new Date() });
    });
  },
);

// @desc    Delete a file
// @route   DELETE /api/files/:id
// @access  Private/Admin
const deleteFile = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const db = req.app.locals.db;
    const { id } = req.params;

    db.get('SELECT * FROM Files WHERE id = ?', [id], (err: any, row: any) => {
      if (err) {
        return next(err);
      }
      if (!row) {
        return res.status(404).json({ message: 'File not found' });
      }

      const filePath = path.join('files', row.uuid);

      db.run('DELETE FROM Files WHERE id = ?', [id], (deleteErr: any) => {
        if (deleteErr) {
          return next(deleteErr);
        }

        fs.unlink(filePath, (fsErr) => {
          if (fsErr && fsErr.code !== 'ENOENT') {
            console.error('Error deleting file:', fsErr);
            res.status(500);
          }
        });

        res.json({ message: 'File deleted successfully' });
      });
    });
  },
);

// @desc    Fetch file contents
// @route   GET /api/files/:uuid/content
// @access  Public
const getFileContentsById = asyncHandler(
  async (req: Request, res: Response, _: NextFunction): Promise<void> => {
    const { uuid } = req.params;
    if (uuid) {
      const filePath = path.join('files', path.basename(uuid));

      try {
        if (fs.existsSync(filePath)) {
          const stats = fs.statSync(filePath);

          if (stats.isFile()) {
            const fileStream = fs.createReadStream(filePath);
            const mimeType = mime.lookup(filePath) || 'application/octet-stream';
            res.setHeader('Content-Type', mimeType);
            res.setHeader('Content-Type', mimeType);
            fileStream.on('error', (err) => {
              res.status(500).json({ err });
            });
            fileStream.pipe(res);
          } else {
            res.status(404).send('File not found');
          }
        } else {
          res.status(404).send('File not found');
        }
      } catch (error) {
        console.error('Error serving file:', error);
        res.status(500).send('Internal Server Error');
      }
    }
  },
);

export { createFile, getFiles, getFileById, deleteFile, getFileContentsById };
