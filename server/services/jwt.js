import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';
import jwt_decode from 'jwt-decode';
import schedule from 'node-schedule';
import { redisRefresh, redisBlockList } from '../configs/redis.js';
import { promisify } from 'util';
const tojwt = promisify(jwt.sign);
const verify = promisify(jwt.verify);

const createToken = async userInfo => {
    return await tojwt(
        {
            userInfo
        },
        process.env.SECRETORKEY,
        {
            expiresIn: 15 * 60
        }
    )
}
const createRefreshToken = async userInfo => {
    return await tojwt(
        {
            userInfo
        },
        process.env.REFRESHSECRETORKEY,
        {
            expiresIn: '1d'
        }
    )
}
async function readyToRefresh(refreshToken) {
    const isInBlockList = await redisBlockList.get(refreshToken);
    return (isInBlockList===null);
}
function tokenExpired(token) {
    try {
        const currentDate = new Date();
        const decodedToken = jwt_decode(token);
        return (decodedToken.exp * 1000 < currentDate.getTime());
    } catch (error) {
        console.log(error);
    }
}
function verifyToken(required = true) {
    return async (req, res, next) => {
        let token = req.headers.authorization;
        token = token ? token.replace('Bearer ', '') : null;
        req.accessToken = null;
        const inBlockList = await redisBlockList.get(token);
        if (token && !inBlockList) {
            try {
                const tokenInfo = await verify(token, process.env.SECRETORKEY);
                req.user = tokenInfo.userInfo;
                return next();
            }
            catch (error) {
                if (error.message === 'jwt expired') {
                    const decodedToken = jwt_decode(token);
                    const refreshToken = await redisRefresh.get(decodedToken.userInfo.email);
                    if (refreshToken) {
                        const ready = await readyToRefresh(refreshToken);
                        if (ready) {
                            req.user = decodedToken.userInfo;
                            token = await createToken(decodedToken.userInfo);
                            req.accessToken = 'Bearer ' + token;
                            return next();
                        }
                    }
                }
                return res.status(401).json({ error: error });
            }
        }
        if (required) {
            return res.status(401).json({ error:'invalid token'});
        }
        return next();
    }
}
//@tokenList option:required
//scan a list of token and remove the expired token from the list
async function removeExpiredToken(tokenList) {
    const stream = tokenList.scanStream();
    stream.on("data", async (resultKeys) => {
        try {
            resultKeys.map(async (key) => {
                const token = await tokenList.get(key);
                if (tokenExpired(token)) {
                    await tokenList.del(key);
                }
            })
        } catch (error) {
            console.log(error);
        }
    })
    .on('end',(error)=>
    {
    });
}
// removed expired token in a token
function removeTokenByTime(time, tokenList) {
    schedule.scheduleJob(time, async function (tokenList) {
        try {
            await removeExpiredToken(tokenList);
        } catch (error) {
            console.log(error);
        }
    }.bind(null, tokenList));
}

export { createToken, createRefreshToken, verifyToken, removeTokenByTime };