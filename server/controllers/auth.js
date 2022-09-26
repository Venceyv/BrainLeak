import { OAuth2Client, UserRefreshClient } from 'google-auth-library';
import jwt_decode from 'jwt-decode';

// Google Oauth 😎
export const postOAuth = async (req, res) => {
    try {
        const oAuth2Client = new OAuth2Client(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            'postmessage'
          );
        
        const { tokens } = await oAuth2Client.getToken(req.body.code);
        console.log('promise resolved', tokens);
        const decoded = jwt_decode(tokens.id_token);
        console.log(decoded);
        res.json(decoded);
    
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
