import { OAuth2Client, UserRefreshClient } from 'google-auth-library';
import { User } from '../models/index.js';
import { createToken } from '../services/jwt.js';
import jwt_decode from 'jwt-decode';
import dotenv from 'dotenv';
dotenv.config();
// Google Oauth 😎
export const postOAuth = async (req, res) => {
  try {
    const oAuth2Client = new OAuth2Client(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      'postmessage'
    );

    const { tokens } = await oAuth2Client.getToken(req.body.code);
    const decoded = jwt_decode(tokens.id_token);
    const userInfo = {
      avatar: decoded.picture,
      username: decoded.name,
      email: decoded.email,
    };
    let user = await User.findOne({ email: userInfo.email });
    if (!user) {
      user = await new User(userInfo).save();
    }
    const token = await createToken(userInfo);
    console.log(token, decoded);
    res.json({ token, decoded });
  } catch (error) {
    console.log('errored', error);
    throw new Error(error);
  }
};

// pending 🤦‍♂️
export const postRefreshToken = async (req, res) => {
  const user = new UserRefreshClient(
    clientId,
    clientSecret,
    req.body.refreshToken
  );

  //refresh token
  const { credentials } = await user.refreshAccessToken();
  console.log(credentials);
  res.json(credentials);
};
