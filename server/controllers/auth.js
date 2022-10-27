import { OAuth2Client, UserRefreshClient } from "google-auth-library";
import { User } from "../models/index.js";
import { createToken, createRefreshToken, saveRefreshToken } from "../services/jwt.js";
import jwt_decode from "jwt-decode";
import dotenv from "dotenv";
dotenv.config();
// Google Oauth 😎
export const postOAuth = async (req, res) => {
  try {
    const oAuth2Client = new OAuth2Client(process.env.CLIENT_ID, process.env.CLIENT_SECRET, "postmessage");
    const { tokens } = await oAuth2Client.getToken(req.body.code);
    const decoded = jwt_decode(tokens.id_token);
    let userInfo = {
      avatar: decoded.picture,
      username: decoded.name,
      email: decoded.email,
    };
    let dbBack = await User.findOne({ email: userInfo.email });
    if (!dbBack || dbBack.isDelete) {
      if(dbBack.isDelete)
      {
        dbBack.isDelete = false;
        dbBack.save();
      }
      else
      {
        dbBack = await new User(userInfo).save();
      }
    }
    userInfo = {
      userId:dbBack._id,
      username:dbBack.username
    }
    let accessToken = await createToken(userInfo);
    console.log(accessToken);
    accessToken = "Bearer " + accessToken;
    const refreshToken = await createRefreshToken(userInfo);
    await saveRefreshToken(userInfo.userId, refreshToken);
    console.log(refreshToken);
    res.status(200).json({ accessToken,refreshToken, dbBack });
  } catch (error) {
    console.log("errored", error);
    throw new Error(error);
  }
};

// pending 🤦‍♂️
export const postRefreshToken = async (req, res) => {
  const user = new UserRefreshClient(clientId, clientSecret, req.body.refreshToken);

  //refresh token
  const { credentials } = await user.refreshAccessToken();
  console.log(credentials);
  res.json(credentials);
};
