import express from 'express';
import { createFile, deleteFile, getFileById, getFiles } from '../controllers/fileController';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'files/' });

router.route('/').get(getFiles).post(upload.single('file'), createFile);

router.route('/:id').get(getFileById).delete(deleteFile);

export default router;
