import { URL } from '../data/Constants';
import { getRequestHeader } from '../utils/getHttpRequestHeader';
import axios from './axiosConfig';

//remove axios

//TODO Promise type
// Google OAuth
export const googleOAuth: Function = async (code: string): Promise<any> => {
  try {
    const { data } = await axios.post('/auth/google', {
      code,
    });
    return data;
  } catch (error) {
    throw error;
  }
};

//log out
export const logOut: Function = async (): Promise<any> => {
  try {
    const user = JSON.parse(localStorage.getItem('userInfo') as string);
    await axios.post(`users/logout/${user._id}`);
  } catch (error) {
    throw error;
  }
};
