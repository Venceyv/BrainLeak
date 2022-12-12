import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import jwt_decode from "jwt-decode";
import schedule from "node-schedule";
import { redisToken } from "../configs/redis.js";
import { promisify } from "util";
import { User } from "../models/index.js";
const tojwt = promisify(jwt.sign);
const verify = promisify(jwt.verify);

const createToken = async (userInfo) => {
  return await tojwt(
    {
      userInfo,
    },
    process.env.SECRETORKEY,
    {
      expiresIn: "1h",
    }
  );
};
//
const createRefreshToken = async (userInfo) => {
  return await tojwt(
    {
      userInfo,
    },
    process.env.REFRESHSECRETORKEY,
    {
      expiresIn: 24 * 60 * 60,
    }
  );
};

function tokenExpired(token) {
  try {
    if(token)
    {
      const currentDate = new Date();
      const decodedToken = jwt_decode(token);
      return decodedToken.exp * 1000 < currentDate.getTime();
    }
   return true;
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
          req.user = await User.findById(tokenInfo.userInfo.userId).lean();
          if (req.user) {
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
function blockToken(token) {
  try {
    const key = token + " BlockList";
    redisToken.set(key, token);
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
function saveRefreshToken(userId, token) {
  try {
    const key = userId + " Refresh";
    redisToken.set(key, token);
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
function delRefreshToken(userEmail) {
  try {
    const key = userEmail + " Refresh";
    redisToken.del(key);
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
function removeTokenByTime(time) {
  schedule.scheduleJob(
    time,
    async function (redisToken) {
      try {
        await removeExpiredToken(redisToken);
      } catch (error) {
        console.log("removeTokenByTime Failed -- Jservice 158");
      }
    }.bind(null, redisToken)
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
