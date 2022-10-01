import express from 'express';
import {getFileUrl} from '../controllers/tools.js';
import { upload } from '../configs/googleCloud.js';
const toolsRouter = express();

toolsRouter.post('/uploadImg',upload.single('imgFile'),getFileUrl);
toolsRouter.post('/uploadVideo',upload.single('videoFile'),getFileUrl);
export {toolsRouter};