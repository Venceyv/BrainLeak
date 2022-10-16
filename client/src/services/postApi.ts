import { axios } from '../lib';

// Google OAuth
export const googleOAuth = async (code: string) => {
  return axios.post('http://localhost:3001/auth/google', {
    code,
  });
};

//
