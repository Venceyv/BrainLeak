import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import jwt_decode from "jwt-decode";
import schedule from "node-schedule";
import { redisToken } from "../configs/redis.js";
import { promisify } from "util";
import { User } from "../models/index.js";
import { getRedisUserInfo, saveRedisUserInfo } from "./userServices.js";
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
      expiresIn: 60 * 60,
    }
  );
};

function tokenExpired(token) {
  try {
    const currentDate = new Date();
    const decodedToken = jwt_decode(token);
    return decodedToken.exp * 1000 < currentDate.getTime();
  } catch (error) {
    console.log("tokenExpired Failed -- Jservice 36");
  }
}
function verifyToken(required = true) {
  return async (req, res, next) => {
    let token = req.headers.authorization;
    token = token ? token.replace("Bearer ", "") : null;
    req.user = null;
    if (token) {
      let inBlockList = await getblockToken(token);
      if (!inBlockList) {
        try {
          const tokenInfo = await verify(token, process.env.SECRETORKEY);
          const user = await getRedisUserInfo(tokenInfo.userInfo.userId);
          if (user) {
            req.user = user;
            return next();
          }
          req.user = await User.findById(tokenInfo.userInfo.userId, { username: 1 }).lean();
          if (req.user) {
            await saveRedisUserInfo(req.user._id, req.user);
            return next();
          }
        } catch (error) {
          return res.status(401).json({ error: error });
        }
      }
    }
    if (required) {
      return res.status(401).json({ error: "invalid token" });
    }
    return next();
  };
}
async function blockToken(token) {
  try {
    const key = token + " BlockList";
    await redisToken.set(key, token);
  } catch (error) {
    console.log("blockToken Failed -- Jservice 91");
  }
}

async function getblockToken(key) {
  try {
    key = key + " BlockList";
    const token = await redisToken.get(key);
    return token;
  } catch (error) {
    console.log("getblockToken Failed -- Jservice 100");
  }
}
async function saveRefreshToken(userId, token) {
  try {
    const key = userId + " Refresh";
    await redisToken.set(key, token);
  } catch (error) {
    console.log("saveRefreshToken Failed -- Jservice 109");
  }
}
async function getRefreshToken(userId) {
  try {
    const key = userId + " Refresh";
    const token = await redisToken.get(key);
    return token;
  } catch (error) {
    console.log("getRefreshToken Failed -- Jservice 117");
  }
}
async function delRefreshToken(userEmail) {
  try {
    const key = userEmail + " Refresh";
    await redisToken.del(key);
  } catch (error) {
    console.log("delRefreshToken Failed -- Jservice 126");
  }
}

//@tokenList option:required
//scan a list of token and remove the expired token from the list
async function removeExpiredToken(tokenList) {
  const stream = tokenList.scanStream();
  stream.on("data", async (resultKeys) => {
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
      console.log("removeExpiredToken Failed -- Jservice 137");
    }
  });
  stream.on("end", () => {});
}
// removed expired token in a token
function removeTokenByTime(time, tokenList) {
  schedule.scheduleJob(
    time,
    async function (tokenList) {
      try {
        await removeExpiredToken(tokenList);
      } catch (error) {
        console.log("removeTokenByTime Failed -- Jservice 158");
      }
    }.bind(null, tokenList)
  );
}

export {
  createToken,
  createRefreshToken,
  verifyToken,
  removeTokenByTime,
  saveRefreshToken,
  delRefreshToken,
  blockToken,
  getRefreshToken,
  getblockToken,
};
