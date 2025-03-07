import request from 'supertest';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { Database } from 'sqlite3';
import { connectDB, runMigrations } from '../database/db';
import { App } from '../app';

describe('Events API Testing', () => {
  let db: Database;
  let app: express.Application;
  const dbPath = 'temp_testing_events.db';

  beforeAll((done) => {
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
    }
    db = connectDB(dbPath);
    runMigrations(db);
    app = App(db);
    done();
  });

  afterAll((done) => {
    db.close(() => {
      if (fs.existsSync(dbPath)) {
        fs.unlinkSync(dbPath);
      }
      done();
    });
  });

  describe('GET /api/events', () => {
    it('should return an empty array when no events exist', async () => {
      const res = await request(app).get('/api/events');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ events: [] });
    });
  });

  describe('POST /api/events', () => {
    it('should return 400 if a required parameter is missing', async () => {
      // Coordinator is missing
      const incompleteEventData = {
        title: 'Incomplete Event',

        description: 'This event is missing a coordinator',
        start: '2025-03-01T10:00:00Z',
      };

      const res = await request(app).post('/api/events').send(incompleteEventData);
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message');
    });

    it('should create a classical event successfully', async () => {
      const classicalEventData = {
        title: 'Classical Event',
        coordinator: 'John Doe',
        description: 'This is a classical event with no repeatable dates',
        start: '2025-03-01T10:00:00Z',
      };

      const res = await request(app).post('/api/events').send(classicalEventData);
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('event');
      expect(res.body.event.title).toBe(classicalEventData.title);
      expect(res.body.event.from_date).toBeUndefined();
      expect(res.body.event.to_date).toBeUndefined();
    });

    it('should create a repeatable event successfully', async () => {
      const repeatableEventData = {
        title: 'Repeatable Event',
        coordinator: 'Jane Doe',
        description: 'This event has repeatable dates',
        start: '2025-03-05T10:00:00Z',
        from_date: '2025-03-05',
        to_date: '2025-03-10',
      };

      const res = await request(app).post('/api/events').send(repeatableEventData);
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('event');
      expect(res.body.event.title).toBe(repeatableEventData.title);
      expect(res.body.event.from_date).toBe(repeatableEventData.from_date);
      expect(res.body.event.to_date).toBe(repeatableEventData.to_date);
    });
  });

  describe('GET /api/events/:id', () => {
    it('should fetch an event by id successfully', async () => {
      const eventData = {
        title: 'Fetchable Event',
        coordinator: 'Alice',
        description: 'Event to fetch by id',
        start: '2025-03-15T10:00:00Z',
      };

      const postRes = await request(app).post('/api/events').send(eventData);
      const eventId = postRes.body.event.id;

      const getRes = await request(app).get(`/api/events/${eventId}`);
      expect(getRes.status).toBe(200);
      expect(getRes.body).toHaveProperty('event');
      expect(getRes.body.event.id).toBe(eventId);
      expect(getRes.body.event.title).toBe(eventData.title);
    });

    it('should return 404 for a non-existent event', async () => {
      const res = await request(app).get('/api/events/9999');
      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Event not found');
    });
  });

  describe('PUT /api/events/:id', () => {
    it('should return 400 if a required parameter is missing during update', async () => {
      const eventData = {
        title: 'Event To Update',
        coordinator: 'Bob',
        description: 'Initial description',
        start: '2025-04-01T10:00:00Z',
      };

      const postRes = await request(app).post('/api/events').send(eventData);
      const eventId = postRes.body.event.id;

      // Description is missing
      const updateData = {
        title: 'Updated Event Title',
        coordinator: 'Bob Updated',
        start: '2025-04-02T10:00:00Z',
      };

      const putRes = await request(app).put(`/api/events/${eventId}`).send(updateData);
      expect(putRes.status).toBe(400);
      expect(putRes.body.message).toBe(
        'Missing required fields: title, coordinator, description, start.',
      );
    });

    it('should update a classical event successfully', async () => {
      const eventData = {
        title: 'Classical Event',
        coordinator: 'Charlie',
        description: 'Event without repeatable dates',
        start: '2025-04-03T10:00:00Z',
      };

      const postRes = await request(app).post('/api/events').send(eventData);
      const eventId = postRes.body.event.id;

      const updateData = {
        title: 'Updated Classical Event',
        coordinator: 'Charlie Updated',
        description: 'Updated classical description',
        start: '2025-04-04T10:00:00Z',
      };

      const putRes = await request(app).put(`/api/events/${eventId}`).send(updateData);
      expect(putRes.status).toBe(200);
      expect(putRes.body).toHaveProperty('event');
      expect(putRes.body.event.title).toBe(updateData.title);
      expect(putRes.body.event.from_date).toBeNull();
      expect(putRes.body.event.to_date).toBeNull();
    });

    it('should update an event to include repeatable dates successfully', async () => {
      const eventData = {
        title: 'Event To Become Repeatable',
        coordinator: 'Dana',
        description: 'Initially classical event',
        start: '2025-04-05T10:00:00Z',
      };

      const postRes = await request(app).post('/api/events').send(eventData);
      const eventId = postRes.body.event.id;

      const updateData = {
        title: 'Now Repeatable Event',
        coordinator: 'Dana',
        description: 'Event with new repeatable dates',
        start: '2025-04-05T10:00:00Z',
        from_date: '2025-04-05',
        to_date: '2025-04-07',
      };

      const putRes = await request(app).put(`/api/events/${eventId}`).send(updateData);
      expect(putRes.status).toBe(200);
      expect(putRes.body).toHaveProperty('event');
      expect(putRes.body.event.title).toBe(updateData.title);
      expect(putRes.body.event.from_date).toBe(updateData.from_date);
      expect(putRes.body.event.to_date).toBe(updateData.to_date);
    });

    it('should update a repeatable event successfully by modifying its repeatable dates', async () => {
      const eventData = {
        title: 'Initial Repeatable Event',
        coordinator: 'Eve',
        description: 'Event with initial repeatable dates',
        start: '2025-04-06T10:00:00Z',
        from_date: '2025-04-06',
        to_date: '2025-04-08',
      };

      const postRes = await request(app).post('/api/events').send(eventData);
      const eventId = postRes.body.event.id;

      const updateData = {
        title: 'Updated Repeatable Event',
        coordinator: 'Eve Updated',
        description: 'Event with modified repeatable dates',
        start: '2025-04-06T10:00:00Z',
        from_date: '2025-04-07',
        to_date: '2025-04-09',
      };

      const putRes = await request(app).put(`/api/events/${eventId}`).send(updateData);
      expect(putRes.status).toBe(200);
      expect(putRes.body).toHaveProperty('event');
      expect(putRes.body.event.title).toBe(updateData.title);
      expect(putRes.body.event.from_date).toBe(updateData.from_date);
      expect(putRes.body.event.to_date).toBe(updateData.to_date);
    });
  });

  describe('DELETE /api/events/:id', () => {
    it('should delete an existing event', async () => {
      const eventData = {
        title: 'Delete Event',
        coordinator: 'Charlie',
        description: 'Event to delete',
        start: '2025-03-30T10:00:00Z',
      };

      const postRes = await request(app).post('/api/events').send(eventData);
      const eventId = postRes.body.event.id;

      const deleteRes = await request(app).delete(`/api/events/${eventId}`);
      expect(deleteRes.status).toBe(200);
      expect(deleteRes.body.message).toBe('Event successfully deleted.');

      const getRes = await request(app).get(`/api/events/${eventId}`);
      expect(getRes.status).toBe(404);
    });

    it('should return 404 when trying to delete a non-existent event', async () => {
      const res = await request(app).delete('/api/events/9999');
      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Event not found!');
    });
  });

  describe('GET /api/events/:id/files', () => {
    it('should return an empty array when no files are attached', async () => {
      const eventData = {
        title: 'Event with no files',
        coordinator: 'Test Coordinator',
        description: 'Event created to test GET files endpoint with no attachments',
        start: '2025-06-01T10:00:00Z',
      };

      const eventResponse = await request(app).post('/api/events').send(eventData);
      expect(eventResponse.status).toBe(201);
      const eventId = eventResponse.body.event.id;

      // Retrieve files attached to the event.
      const res = await request(app).get(`/api/events/${eventId}/files`);
      expect(res.status).toBe(200);
      expect(res.body.files).toEqual([]);
    });
  });

  describe('POST /api/events/:id/files', () => {
    it('should attach a file to an event after creating the file via /api/files', async () => {
      const eventData = {
        title: 'Event for file attachment',
        coordinator: 'Test Coordinator',
        description: 'Event to test file attachment',
        start: '2025-06-02T10:00:00Z',
      };

      const eventResponse = await request(app).post('/api/events').send(eventData);
      expect(eventResponse.status).toBe(201);
      const eventId = eventResponse.body.event.id;

      const tempFileName = 'temp_upload.txt';
      const tempFilePath = path.join(__dirname, tempFileName);
      fs.writeFileSync(tempFilePath, 'Test file content');

      const fileResponse = await request(app)
        .post('/api/files')
        .field('name', 'Test File')
        .field('path', tempFilePath)
        .attach('file', tempFilePath);
      expect(fileResponse.status).toBe(201);
      expect(fileResponse.body).toHaveProperty('id');
      const fileId = fileResponse.body.id;

      const attachResponse = await request(app)
        .post(`/api/events/${eventId}/files`)
        .send({ fileId });
      expect(attachResponse.status).toBe(201);
      expect(Array.isArray(attachResponse.body.files)).toBe(true);
      const attachedFile = attachResponse.body.files.find((f: any) => f.id === fileId);
      expect(attachedFile).toBeDefined();
      expect(attachedFile.name).toBe('Test File');

      fs.unlinkSync(tempFilePath);
    });
  });
});
