import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();
//for refresh token
const redisToken = new Redis({
  port: process.env.REDIS_PORT_TOKEN,
  host: process.env.REDIS_HOST_TOKEN,
  username: process.env.REDIS_USERNAME_TOKEN,
  password: process.env.REDIS_PASSWORD_TOKEN,
});

const redisTrending = new Redis({
  port: process.env.REDIS_PORT_TRENDING,
  host: process.env.REDIS_HOST_TRENDING,
  username: process.env.REDIS_USERNAME_TRENDING,
  password: process.env.REDIS_PASSWORD_TRENDING,
});

export { redisToken, redisTrending };
