// import { OAuth2Client, UserRefreshClient } from 'google-auth-library';

// const oAuth2Client = new OAuth2Client(
//   process.env.CLIENT_ID,
//   process.env.CLIENT_SECRET,
//   'postmessage'
// );

// export const postOAuth = async (req, res) => {
//   try {
//     // code -> token exchange
//     const { tokens } = await oAuth2Client.getToken(req.body.code);
//     console.log(tokens);

//     res.json(tokens);
//   } catch (error) {
//     return new Error(error);
//   }
// };

// export const postRefreshToken = async (req, res) => {
//   const user = new UserRefreshClient(
//     clientId,
//     clientSecret,
//     req.body.refreshToken
//   );

//   //refresh token
//   const { credentials } = await user.refreshAccessToken();
//   res.json(credentials);
// };
