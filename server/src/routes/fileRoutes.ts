import express from 'express';
import {
  createFile,
  deleteFile,
  getFileById,
  getFiles,
  getFileContentsById,
} from '../controllers/fileController';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';

const router = express.Router();

const uploadDir = path.resolve(__dirname, '../files');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log(`Created upload directory at ${uploadDir}`);
}

const storage = multer.diskStorage({
  destination: 'files/',
  filename: (_, file, cb) => {
    const uniqueSuffix = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}`);
  },
});
const upload = multer({ storage });

router.route('/').get(getFiles).post(upload.single('file'), createFile);

router.route('/:id').get(getFileById).delete(deleteFile);
router.route('/:uuid/content').get(getFileContentsById);

export default router;