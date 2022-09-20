import express from 'express';
import mongooseConfig from './configs/mongoose.config.js';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import { OAuth2Client, UserRefreshClient } from 'google-auth-library';

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: '10mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

const oAuth2Client = new OAuth2Client(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  'postmessage'
);

const PORT = process.env.PORT || 3001;
const DB_URL = process.env.CONNECTION_URL;

app.get('/', async (req, res) => res.send('hello'));

app.post('/auth/google', async (req, res) => {
  try {
    const { tokens } = await oAuth2Client.getToken(req.body.code);
    // console.log('return token', tokens);
    console.log('promise resolved', tokens);
    // res.json(tokens);
  } catch (error) {
    console.log('errored', error);
  }
});

mongooseConfig(DB_URL).then(() => {
  app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
});
