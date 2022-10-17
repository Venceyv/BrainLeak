import express from 'express';
import dotenv from 'dotenv'
import bodyParser from 'body-parser';
import EventEmitter from 'events'
import cors from 'cors';
import {userRouter} from './routes/users.js';
import  {postRouter} from './routes/post.js'
import { toolsRouter } from './routes/tools.js';
import mongooseConfig from './configs/mongoose.config.js';
import { clearTrendingByTime } from './services/postServices.js';
import authRouter from './routes/auth.js';
import { removeTokenByTime } from './services/jwt.js';
import { redisComments, redisPosts, redisReplies, redisToken, redisTrending, redisUsers } from './configs/redis.js';
import { clearCommentByTime } from './services/commentServices.js';
import { clearReplyByTime } from './services/replyServices.js';


EventEmitter.defaultMaxListeners=11;
dotenv.config();
const app = express()
app.use(cors());
app.use(bodyParser.json({ limit: '10mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

const PORT = process.env.PORT || 3001;
const DATABASE_URL = process.env.DATABASE_URL;

app.use(express.json());

app.use('/auth', authRouter);
app.use('/users',userRouter);
app.use('/posts',postRouter);
app.use('/tools',toolsRouter);

//every Sunday at 2 a.m
clearTrendingByTime('0 0 2 * * 0');
removeTokenByTime('0 5 2 * * 0');
clearCommentByTime('0 10 2 * * 0');
clearReplyByTime('0 15 2 * * 0');

mongooseConfig(DATABASE_URL).then(() => {
    app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
  })
.catch(err=> {
    console.log('mongooseConfigError');
})

