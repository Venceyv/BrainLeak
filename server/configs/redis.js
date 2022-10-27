import Redis from 'ioredis';
import dotenv from 'dotenv';
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
})

const redisUsers = new Redis({
    port: process.env.REDIS_PORT_USERS,
    host: process.env.REDIS_HOST_USERS,
    username: process.env.REDIS_USERNAME_USERS,
    password: process.env.REDIS_PASSWORD_USERS,
})

const redisPosts = new Redis({
    port: process.env.REDIS_PORT_POSTS,
    host: process.env.REDIS_HOST_POSTS,
    username: process.env.REDIS_USERNAME_POSTS,
    password: process.env.REDIS_PASSWORD_POSTS,
})

const redisComments = new Redis({
    port: process.env.REDIS_PORT_COMMENTS,
    host: process.env.REDIS_HOST_COMMENTS,
    username: process.env.REDIS_USERNAME_COMMENTS,
    password: process.env.REDIS_PASSWORD_COMMENTS,
})

const redisReplies= new Redis({
    port: process.env.REDIS_PORT_REPLIES,
    host: process.env.REDIS_HOST_REPLIES,
    username: process.env.REDIS_USERNAME_REPLIES,
    password: process.env.REDIS_PASSWORD_REPLIES,
})

export {
    redisToken,redisTrending,redisUsers,
    redisPosts,redisComments,redisReplies
};
