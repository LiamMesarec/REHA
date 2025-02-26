import request from "supertest";
import fs from "fs";
import express from "express";
import { Database } from "sqlite3";
import {connectDB, runMigrations} from "../src/database/db";
import { App } from '../src/app'
import path from "path";

function generateRandomFile(directory: string, fileName?: string): string {
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }

    const file = fileName || `temp_testfile_${Math.random().toString(36).substring(7)}.txt`;
    const filePath = path.join(directory, file);

    const content = `RANDOM TEXT: ${Math.random().toString(36).substring(7)}`;

    fs.writeFileSync(filePath, content);

    return filePath;
};

describe("Files Unit Test", () => {
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

    describe("GET /files", () => {
        it("Return all files (empty)", async () => {
            const response = await request(app).get("/api/files");
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ files: [] });
        });
    });

describe("POST /files", () => {
    it("Create 10 files and verify them", async () => {
        const filePaths: string[] = [];
        const numberOfFiles = 10;

        for (let i = 0; i < numberOfFiles; i++) {
            const fileName = `test${i}.txt`;
            const filePath = generateRandomFile("test_files", fileName);
            filePaths.push(filePath);

            const postResponse = await request(app)
                .post("/api/files")
                .set("Content-Type", "multipart/form-data")
                .field("name", fileName)
                .field("path", filePath)
                .attach("file", filePath);

            expect(postResponse.status).toBe(201);
            expect(postResponse.body).toHaveProperty("id");
            expect(postResponse.body.name).toBe(fileName);
            expect(postResponse.body.path).toBe(filePath);
        }

        const getResponse = await request(app).get("/api/files");
        expect(getResponse.status).toBe(200);
        expect(getResponse.body.files).toHaveLength(numberOfFiles);

        getResponse.body.files.forEach((file: any, index: number) => {
            expect(file.name).toBe(`test${index}.txt`);
            expect(file.path).toBe(filePaths[index]);
        });

filePaths.forEach(filePath => {
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    } catch (err) {
        console.error(`Error deleting file ${filePath}:`, err);
    }
});

    });
});

    afterAll((done) => {
        db.close(() => {
            if (fs.existsSync(dbPath)) {
                fs.unlinkSync(dbPath);
            }
            done();
        });
    });
});
