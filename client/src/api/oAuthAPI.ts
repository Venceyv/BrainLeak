import { URL } from '../data/Constants';
import axios from './axiosConfig';

//remove axios

//TODO Promise type
// Google OAuth
export const googleOAuth: Function = async (code: string): Promise<any> => {
  try {
    const { data } = await axios.post(`${URL}/auth/google`, {
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
    await axios.post(`${URL}/users/${user._id}/logout`);
  } catch (error) {
    throw error;
  }
};
