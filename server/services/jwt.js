import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';
import jwt_decode from 'jwt-decode';
import schedule from 'node-schedule';
import { redisToken } from '../configs/redis.js';
import { promisify } from 'util';
import { User } from '../models/index.js';
import { getRedisUserInfo, saveRedisUserInfo } from './userServices.js';
const tojwt = promisify(jwt.sign);
const verify = promisify(jwt.verify);

const createToken = async (userInfo) => {
  return await tojwt(
    {
      userInfo,
    },
    process.env.SECRETORKEY,
    {
      expiresIn: 15 * 60,
    }
  );
};
const createRefreshToken = async (userInfo) => {
  return await tojwt(
    {
      userInfo,
    },
    process.env.REFRESHSECRETORKEY,
    {
      expiresIn: '1d',
    }
  );
};

function tokenExpired(token) {
  try {
    const currentDate = new Date();
    const decodedToken = jwt_decode(token);
    return decodedToken.exp * 1000 < currentDate.getTime();
  } catch (error) {
    console.log('tokenExpired Failed -- Jservice 36');
  }
}
function verifyToken(required = true) {
  return async (req, res, next) => {
    let token = req.headers.authorization;
    token = token ? token.replace('Bearer ', '') : null;
    req.user = null;
    req.accessToken = null;
    if (token) {
      let inBlockList = await getblockToken(token);
      if (!inBlockList) {
        try {
          const tokenInfo = await verify(token, process.env.SECRETORKEY);
          const user = await getRedisUserInfo(tokenInfo.userInfo.email);
          if (user) {
            req.user = user;
            return next();
          }
          req.user = await User.findOne({ email: tokenInfo.userInfo.email }, { email: 1, username: 1 }).lean();
          await saveRedisUserInfo(req.user.email, req.user);
          return next();
        } catch (error) {
          if (error.message === 'jwt expired') {
            const decodedToken = jwt_decode(token);
            const refreshToken = await getRefreshToken(decodedToken.userInfo.email);
            if (refreshToken) {
              inBlockList = await getblockToken(refreshToken);
              if (!inBlockList) {
                req.user = await User.findOne({ email: decodedToken.userInfo.email }, { email: 1, username: 1 }).lean();
                token = await createToken(decodedToken.userInfo);
                req.accessToken = 'Bearer ' + token;
                return next();
              }
            }
          }
          return res.status(401).json({ error: error });
        }
      }
    }
    if (required) {
      return res.status(401).json({ error: 'invalid token' });
    }
    return next();
  };
}
async function blockToken(token) {
  try {
    const key = token + ' BlockList';
    await redisToken.set(key, token);
  } catch (error) {
    console.log('blockToken Failed -- Jservice 91');
  }
}

async function getblockToken(key) {
  try {
    key = key + ' BlockList';
    const token = await redisToken.get(key);
    return token;
  } catch (error) {
    console.log('getblockToken Failed -- Jservice 100');
  }
}
async function saveRefreshToken(userEmail, token) {
  try {
    const key = userEmail + ' Refresh';
    await redisToken.set(key, token);
  } catch (error) {
    console.log('saveRefreshToken Failed -- Jservice 109');
  }
}
async function getRefreshToken(userEmail) {
  try {
    const key = userEmail + ' Refresh';
    const token = await redisToken.get(key);
    return token;
  } catch (error) {
    console.log('getRefreshToken Failed -- Jservice 117');
  }
}
async function delRefreshToken(userEmail) {
  try {
    const key = userEmail + ' Refresh';
    await redisToken.del(key);
  } catch (error) {
    console.log('delRefreshToken Failed -- Jservice 126');
  }
}

//@tokenList option:required
//scan a list of token and remove the expired token from the list
async function removeExpiredToken(tokenList) {
  const stream = tokenList.scanStream();
  stream.on('data', async (resultKeys) => {
    try {
      if (resultKeys.length != 0) {
        resultKeys.map(async (key) => {
          const token = await tokenList.get(key);
          if (tokenExpired(token)) {
            await tokenList.del(key);
          }
        });
      }
    } catch (error) {
      console.log('removeExpiredToken Failed -- Jservice 137');
    }
  });
  stream.on('end', () => {});
}
// removed expired token in a token
function removeTokenByTime(time, tokenList) {
  schedule.scheduleJob(
    time,
    async function (tokenList) {
      try {
        await removeExpiredToken(tokenList);
      } catch (error) {
        console.log('removeTokenByTime Failed -- Jservice 158');
      }
    }.bind(null, tokenList)
  );
}

export { createToken, createRefreshToken, verifyToken, removeTokenByTime, saveRefreshToken, delRefreshToken, blockToken, getRefreshToken };
