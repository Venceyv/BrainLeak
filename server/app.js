import express from 'express';
import mongooseConfig from './configs/mongoose.config.js';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import jwt_decode from 'jwt-decode';

import authRouter from './routes/auth.js';


dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: '10mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

const PORT = process.env.PORT || 3001;
const DB_URL = process.env.CONNECTION_URL;

app.get('/', async (req, res) => res.send('hello'));
app.use('/auth', authRouter);

mongooseConfig(DB_URL).then(() => {
  app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
});
