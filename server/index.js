import express from 'express';
import dotenv from 'dotenv'
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import {userRouter} from './routes/users.js';
import  {postRouter} from './routes/post.js'
import { toolsRouter } from './routes/tools.js';
import mongooseConfig from './configs/mongoose.config.js';

import authRouter from './routes/auth.js';

dotenv.config();
const app = express()
app.use(cors());
app.use(bodyParser.json({ limit: '10mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

const PORT = process.env.PORT || 3001;
const DATABASE_URL = process.env.DATABASE_URL;



app.use(express.json());
app.use(morgan('dev'));
app.use('/auth', authRouter);
app.use('/users',userRouter);
app.use('/posts',postRouter);
app.use('/tools',toolsRouter);

mongooseConfig(DATABASE_URL).then(() => {
    app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
  })
.catch(err=> {
    console.log(err);
})

