import { axios } from '../lib';

// Google OAuth
const googleOAuth = async (code: string) => {
  return axios.post('http://localhost:3001/auth/google', {
    code,
  });
};

export default googleOAuth
