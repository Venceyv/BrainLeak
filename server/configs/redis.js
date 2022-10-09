import Redis from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();
//for refresh token
const redisRefresh = new Redis({
    port:process.env.REDIS_PORT_RREFRESH,
    host:process.env.REDIS_HOST_RREFRESH,
    username:process.env.REDIS_USERNAME_RREFRESH,
    password:process.env.REDIS_PASSWORD_RREFRESH,
    
});
const redisBlockList = new Redis({
    port:process.env.REDIS_PORT_BLOCKLIST,
    host:process.env.REDIS_HOST_BLOCKLIST,
    username:process.env.REDIS_USERNAME_BLOCKLIST,
    password:process.env.REDIS_PASSWORD_BLOCKLIST,
});
const redisUserInfo = new Redis({
    port:process.env.REDIS_PORT_USERINFO,
    host:process.env.REDIS_HOST_USERINFO,
    username:process.env.REDIS_USERNAME_USERINFO,
    password:process.env.REDIS_PASSWORD_USERINFO,
})
const redisPostInfo = new Redis({
    port:process.env.REDIS_PORT_POSTINFO,
    host:process.env.REDIS_HOST_POSTINFO,
    username:process.env.REDIS_USERNAME_POSTINFO,
    password:process.env.REDIS_PASSWORD_POSTINFO,
})

export {redisRefresh,redisBlockList,redisUserInfo,redisPostInfo};
