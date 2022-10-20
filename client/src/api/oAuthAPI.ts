import axios from 'axios';
import { URL } from '../data/Constants';
import { getRequestHeader } from '../utils/getHttpRequestHeader';
import { axiosInstance } from './axiosConfig';

//remove axios

//TODO Promise type
// Google OAuth
export const googleOAuth: Function = async (code: string): Promise<any> => {
  try {
    const { data } = await axiosInstance.post('/auth/google', {
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
    await axiosInstance.post(`users/logout/${user._id}`);
  } catch (error) {
    throw error;
  }
};
