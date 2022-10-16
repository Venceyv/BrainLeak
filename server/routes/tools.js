import { Router } from 'express';
import {getFileUrl} from '../controllers/tools.js';
import { upload } from '../configs/googleCloud.js';
const toolsRouter = Router();

toolsRouter.post('/uploadImg',upload.single('imgFile'),getFileUrl);
toolsRouter.post('/uploadVideo',upload.single('videoFile'),getFileUrl);
export {toolsRouter};