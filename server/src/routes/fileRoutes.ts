import express from "express";
import {
  createFile,
  deleteFile,
  getFileById,
  getFiles,
} from "../controllers/fileController";

const router = express.Router();

router.route("/").get(getFiles).post(createFile);

router.route("/:id").get(getFileById).delete(deleteFile);

export default router;
