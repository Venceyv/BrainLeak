import express from 'express';
import dotenv from 'dotenv'
import bodyParser from 'body-parser';
import cors from 'cors';
import {userRouter} from './routes/users.js';
import  {postRouter} from './routes/post.js'
import { toolsRouter } from './routes/tools.js';
import mongooseConfig from './configs/mongoose.config.js';
import { redisRefresh,redisBlockList,redisUserInfo,redisPostInfo } from './configs/redis.js';
import { clearCacheByTime } from './services/redisServices.js';
import { clearCommentByTime } from './services/commentServices.js';
import { removeTokenByTime } from './services/jwt.js';
import { clearReplyByTime } from './services/replyServices.js';
import authRouter from './routes/auth.js';


dotenv.config();
const app = express()
app.use(cors());
app.use(bodyParser.json({ limit: '10mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

const PORT = process.env.PORT || 3001;
const DATABASE_URL = process.env.DATABASE_URL;

// every day 5 a.m
removeTokenByTime('5 * * *',redisBlockList);
removeTokenByTime('5 * * *',redisRefresh);
// every Sunday at 5 a.m
clearCacheByTime('5 * * 0',redisUserInfo);
clearCacheByTime('5 * * 0',redisPostInfo);
// every first day of the month at 5 a.m
clearCommentByTime('5 1 * *');
clearReplyByTime('5 1 * *')
app.use(express.json());

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

