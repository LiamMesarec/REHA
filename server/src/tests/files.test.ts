import request from 'supertest';
import fs from 'fs';
import express from 'express';
import { Database } from 'sqlite3';
import { connectDB, runMigrations } from '../database/db';
import { App } from '../app';
import path from 'path';
import mime from 'mime-types';

function generateRandomFile(directory: string, fileName?: string): string {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }

  const file = fileName || `temp_testfile_${Math.random().toString(36).substring(7)}.txt`;
  const filePath = path.join(directory, file);

  const content = `RANDOM TEXT: ${Math.random().toString(36).substring(7)}`;

  fs.writeFileSync(filePath, content);

  return filePath;
}

describe('Files Unit Test', () => {
  let db: Database;
  let app: express.Application;
  const dbPath = 'temp_testing.db';

  beforeAll((done) => {
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
    }

    db = connectDB(dbPath);
    runMigrations(db);
    app = App(db);

    done();
  });

  describe('GET /files', () => {
    it('Return all files (empty)', async () => {
      const response = await request(app).get('/api/files');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ files: [] });
    });
  });

  describe('POST /files, GET /files', () => {
    it('Create files, verify they exist', async () => {
      const filePaths: string[] = [];
      const numberOfFiles = 10;

      for (let i = 0; i < numberOfFiles; i++) {
        const fileName = `test${i}.txt`;
        const filePath = generateRandomFile('test_files', fileName);
        filePaths.push(filePath);

        const postResponse = await request(app)
          .post('/api/files')
          .set('Content-Type', 'multipart/form-data')
          .field('name', fileName)
          .field('path', filePath)
          .attach('file', filePath);

        expect(postResponse.status).toBe(201);
        expect(postResponse.body).toHaveProperty('id');
        expect(postResponse.body.name).toBe(fileName);
        expect(postResponse.body.path).toBe(filePath);
      }

      const getResponse = await request(app).get('/api/files');
      expect(getResponse.status).toBe(200);
      expect(getResponse.body.files).toHaveLength(numberOfFiles);

      getResponse.body.files.forEach((file: any, index: number) => {
        expect(file.name).toBe(`test${index}.txt`);
        expect(file.path).toBe(filePaths[index]);
      });

      const response = await request(app).get('/api/files');
      expect(response.status).toBe(200);
      expect(response.body.files).toHaveLength(numberOfFiles);
    });
  });

  describe('GET /files/:uuid/contents', () => {
    it('Upload a file and verify contents', async () => {
      const fileName = `test_upload_${Math.random().toString(36).substring(7)}.txt`;
      const filePath = generateRandomFile('test_files', fileName);
      const fileContent = fs.readFileSync(filePath);

      const postResponse = await request(app)
        .post('/api/files')
        .set('Content-Type', 'multipart/form-data')
        .field('name', fileName)
        .field('path', filePath)
        .attach('file', filePath);

      expect(postResponse.status).toBe(201);
      expect(postResponse.body).toHaveProperty('id');
      expect(postResponse.body.name).toBe(fileName);
      expect(postResponse.body.path).toBe(filePath);

      const uuid = postResponse.body.uuid;

      const contentResponse = await request(app)
        .get(`/api/files/${uuid}/content`)
        .buffer(true)
        .parse((res, cb) => {
          let data = Buffer.alloc(0);
          res.on('data', (chunk) => {
            data = Buffer.concat([data, chunk]);
          });
          res.on('end', () => cb(null, data));
        });

      expect(contentResponse.status).toBe(200);
      expect(Buffer.compare(contentResponse.body, fileContent)).toBe(0);
    });
  });

  describe('DELETE /files/:id', () => {
    it('Create and delete a file.', async () => {
      const fileName = `test_delete_${Math.random().toString(36).substring(7)}.txt`;
      const filePath = generateRandomFile('test_files', fileName);

      const postResponse = await request(app)
        .post('/api/files')
        .set('Content-Type', 'multipart/form-data')
        .field('name', fileName)
        .field('path', filePath)
        .attach('file', filePath);

      expect(postResponse.status).toBe(201);
      expect(postResponse.body).toHaveProperty('id');

      const fileId = postResponse.body.id;

      expect(fs.existsSync(path.join('files', postResponse.body.uuid))).toBe(true);
      const deleteResponse = await request(app).delete(`/api/files/${fileId}`);
      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.body.message).toBe('File deleted successfully');

      const getResponse = await request(app).get(`/api/files/${fileId}`);
      expect(getResponse.status).toBe(404);

      expect(fs.existsSync(path.join('files', postResponse.body.uuid))).toBe(false);
    });
  });

  describe('POST /files MIME Type', () => {
    it('should return the correct MIME type for a file', async () => {
      const fileName = 'test_mime.txt';
      const filePath = path.join('test_files', fileName);

      fs.writeFileSync(filePath, 'test');

      const postResponse = await request(app)
        .post('/api/files')
        .set('Content-Type', 'multipart/form-data')
        .field('name', fileName)
        .field('path', filePath)
        .attach('file', filePath);

      expect(postResponse.status).toBe(201);

      const uuid = postResponse.body.uuid;
      const expectedMimeType = mime.lookup(filePath) || 'application/octet-stream';

      const contentResponse = await request(app).get(`/api/files/${uuid}/content`);

      expect(contentResponse.status).toBe(200);
      expect(contentResponse.headers['content-type']).toBe(expectedMimeType);
    });
  });

  afterAll((done) => {
    db.close(() => {
      if (fs.existsSync(dbPath)) {
        fs.unlinkSync(dbPath);
      }
      done();
    });

    fs.rmSync('test_files', { recursive: true, force: true });
    fs.rmSync('files', { recursive: true, force: true });
    fs.rmSync('test_uploads', { recursive: true, force: true });
  });
});
