import { Request, Response, NextFunction } from 'express';
import asyncHandler from '../middleware/asyncHandler';

// @desc    Fetch all events
// @route   GET /api/events
// @access  Public
const getEvents = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const db = req.app.locals.db;

    db.all(
      'SELECT Events.*, RepeatableEvents.from_date, RepeatableEvents.to_date FROM Events LEFT JOIN RepeatableEvents ON Events.id = RepeatableEvents.event_id',
      [],
      (err: any, rows: any) => {
        if (err) {
          return next(err);
        }
        res.status(200).json({ events: rows });
        return;
      },
    );
  },
);

// @desc    Fetch an event information
// @route   GET /api/events/:id
// @access  Public
const getEventById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const db = req.app.locals.db;
    const { id } = req.params;

    db.get(
      `SELECT 
        Events.*,
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
          res.status(404).json({ message: 'Event not found' });
          return;
        }

        res.status(200).json({ event: row });
        return;
      },
    );
  },
);

// @desc    Fetch all files of an event
// @route   GET /api/events/:id/files
// @access  Public
const getFilesByEventId = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const db = req.app.locals.db;
    const { id } = req.params;

    db.get('SELECT id FROM Events WHERE id = ?', [id], (err: any, row: any) => {
      if (err) {
        return next(err);
      }
      if (!row) {
        res.status(404).json({ message: 'Event not found!' });
        return;
      }

      db.all(
        `SELECT 
          Files.*
        FROM Files 
         LEFT JOIN EventFiles ON Files.id = EventFiles.file_id
         WHERE EventFiles.event_id = ?`,
        [id],
        (err: any, rows: any) => {
          if (err) {
            return next(err);
          }

          if (!rows || rows.length === 0) {
            return res.status(200).json({ files: [] });
          }

          res.status(200).json({ files: rows });
        },
      );
    });
  },
);

// @desc    Attach a file to an event and return the updated file list
// @route   POST /api/events/:id/files
// @access  Student/Mentor/Admin  (accessLevel >= 1)
const attachFileToEvent = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const db = req.app.locals.db;
    const { id } = req.params;
    const { fileId } = req.body;

    const user = await req.body.user;
    if (user == null) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    if (user[1] < 1) {
      res.status(401).json({ message: 'Forbidden' });
      return;
    }
    if (!fileId) {
      res.status(400).json({ message: 'Missing required field: fileId' });
      return;
    }

    db.get('SELECT id FROM Events WHERE id = ?', [id], (err: any, event: any) => {
      if (err) {
        return next(err);
      }
      if (!event) {
        res.status(404).json({ message: 'Event not found' });
        return;
      }

      db.run(
        'INSERT INTO EventFiles (event_id, file_id) VALUES (?, ?)',
        [id, fileId],
        (err: any) => {
          if (err) {
            return next(err);
          }

          db.all(
            `SELECT Files.id, Files.path, Files.name
           FROM Files 
           INNER JOIN EventFiles ON Files.id = EventFiles.file_id
           WHERE EventFiles.event_id = ?`,
            [id],
            (err: any, files: any) => {
              if (err) {
                return next(err);
              }
              res.status(201).json({
                files: files || [],
              });
              return;
            },
          );
        },
      );
    });
  },
);

// @desc    Unlink a file from an event and return the updated file list
// @route   DELETE /api/events/:id/files
// @access  Student/Mentor/Admin  (accessLevel >= 1)
const unlinkFileFromEvent = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const db = req.app.locals.db;
    const { id } = req.params;
    const { fileId } = req.body;

    // --- Authentication & Authorization ---
    const user = await req.body.user;
    if (!user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    if (user[1] < 1) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }
    if (!fileId) {
      res.status(400).json({ message: 'Missing required field: fileId' });
      return;
    }

    // --- Verify event exists ---
    db.get(
      'SELECT id FROM Events WHERE id = ?',
      [id],
      (err: any, event: any) => {
        if (err) {
          return next(err);
        }
        if (!event) {
          res.status(404).json({ message: 'Event not found' });
          return;
        }

        // --- Perform the unlink (harmless if not linked) ---
        db.run(
          'DELETE FROM EventFiles WHERE event_id = ? AND file_id = ?',
          [id, fileId],
          (err: any) => {
            if (err) {
              return next(err);
            }

            // --- Return updated file list ---
            db.all(
              `
              SELECT
                Files.id,
                Files.path,
                Files.name
              FROM Files
              INNER JOIN EventFiles
                ON Files.id = EventFiles.file_id
              WHERE EventFiles.event_id = ?
              `,
              [id],
              (err: any, files: any) => {
                if (err) {
                  return next(err);
                }
                res.status(200).json({
                  files: files || [],
                });
              }
            );
          }
        );
      }
    );
  }
);


// @desc    Create an event
// @route   POST /api/events
// @access  Student/Mentor/Admin (accessLevel >= 1)
const createEvent = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const db = req.app.locals.db;
    const { title, coordinator, description, location, start, from_date, to_date } = req.body;
    const user = await req.body.user;

    if (user == null) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    if (user[1] < 1) {
      res.status(401).json({ message: 'Forbidden' });
      return;
    }

    if (!title || !coordinator || !description || !start) {
      res.status(400).json({
        message: 'Missing required fields: title, coordinator, description, start.',
      });
      return;
    }

    db.run(
      `INSERT INTO Events (title, coordinator, description, location, start)
        VALUES (?, ?, ?, ?)`,
      [title, coordinator, description, location, start],
      (err: any) => {
        if (err) {
          return next(err);
        }

        // Getting Events.id for foreign key
        db.get('SELECT last_insert_rowid() AS id', (err: any, row: any) => {
          if (err) {
            return next(err);
          }
          const newEventId = row.id;

          if (from_date && to_date) {
            db.run(
              `INSERT INTO RepeatableEvents (from_date, to_date, event_id)
                VALUES (?, ?, ?)`,
              [from_date, to_date, newEventId],
              (err: any) => {
                if (err) {
                  return next(err);
                }

                db.get(
                  `SELECT Events.*, RepeatableEvents.from_date, RepeatableEvents.to_date
                    FROM Events
                    LEFT JOIN RepeatableEvents ON Events.id = RepeatableEvents.event_id
                    WHERE Events.id = ?`,
                  [newEventId],
                  (err: any, eventRow: any) => {
                    if (err) {
                      return next(err);
                    }
                    res.status(201).json({ event: eventRow });
                    return;
                  },
                );
              },
            );
          } else {
            db.get('SELECT * FROM Events WHERE id = ?', [newEventId], (err: any, eventRow: any) => {
              if (err) {
                return next(err);
              }
              res.status(201).json({ event: eventRow });
              return;
            });
          }
        });
      },
    );
  },
);

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Student/Mentor/Admin (accessLevel >= 1)
const updateEvent = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const db = req.app.locals.db;
    const { id } = req.params;
    const { title, coordinator, description, location, start, from_date, to_date } = req.body;

    const user = await req.body.user;
    if (user == null) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    if (user[1] < 1) {
      res.status(401).json({ message: 'Forbidden' });
      return;
    }

    if (!title || !coordinator || !description || !start) {
      res.status(400).json({
        message: 'Missing required fields: title, coordinator, description, start.',
      });
      return;
    }

    db.run(
      `UPDATE Events SET title = ?, coordinator = ?, description = ?, location = ?, start = ? WHERE id = ?`,
      [title, coordinator, description, location, start, id],
      (err: any) => {
        if (err) {
          return next(err);
        }

        if (from_date && to_date) {
          db.get(
            `SELECT * FROM RepeatableEvents WHERE event_id = ?`,
            [id],
            (err: any, row: any) => {
              if (err) {
                return next(err);
              }
              if (row) {
                db.run(
                  `UPDATE RepeatableEvents SET from_date = ?, to_date = ? WHERE event_id = ?`,
                  [from_date, to_date, id],
                  (err: any) => {
                    if (err) {
                      return next(err);
                    }
                    db.get(
                      `SELECT Events.*, RepeatableEvents.from_date, RepeatableEvents.to_date
                       FROM Events
                       LEFT JOIN RepeatableEvents ON Events.id = RepeatableEvents.event_id
                       WHERE Events.id = ?`,
                      [id],
                      (err: any, eventRow: any) => {
                        if (err) {
                          return next(err);
                        }
                        res.status(200).json({ event: eventRow });
                        return;
                      },
                    );
                  },
                );
              } else {
                db.run(
                  `INSERT INTO RepeatableEvents (from_date, to_date, event_id) VALUES (?, ?, ?)`,
                  [from_date, to_date, id],
                  (err: any) => {
                    if (err) {
                      return next(err);
                    }
                    db.get(
                      `SELECT Events.*, RepeatableEvents.from_date, RepeatableEvents.to_date
                       FROM Events
                       LEFT JOIN RepeatableEvents ON Events.id = RepeatableEvents.event_id
                       WHERE Events.id = ?`,
                      [id],
                      (err: any, eventRow: any) => {
                        if (err) {
                          return next(err);
                        }
                        res.status(200).json({ event: eventRow });
                        return;
                      },
                    );
                  },
                );
              }
            },
          );
        } else {
          db.get(
            `SELECT Events.*, RepeatableEvents.from_date, RepeatableEvents.to_date
             FROM Events
             LEFT JOIN RepeatableEvents ON Events.id = RepeatableEvents.event_id
             WHERE Events.id = ?`,
            [id],
            (err: any, eventRow: any) => {
              if (err) {
                return next(err);
              }
              res.status(200).json({ event: eventRow });
              return;
            },
          );
        }
      },
    );
  },
);

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Mentor/Admin   (accessLevel >= 2)
const deleteEvent = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const db = req.app.locals.db;
    const { id } = req.params;
    const user = await req.body.user;
    if (user == null) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    if (user[1] < 2) {
      res.status(401).json({ message: 'Forbidden' });
      return;
    }

    db.get('SELECT id FROM Events WHERE id = ?', [id], (err: any, row: any) => {
      if (err) {
        return next(err);
      }
      if (!row) {
        res.status(404).json({ message: 'Event not found!' });
        return;
      }

      db.run('DELETE FROM Events WHERE id = ?', [id], (err2: any) => {
        if (err2) {
          return next(err2);
        }

        res.status(200).json({
          message: 'Event successfully deleted.',
        });
        return;
      });
    });
  },
);

export {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getFilesByEventId,
  attachFileToEvent,
  unlinkFileFromEvent
};
