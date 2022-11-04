import { AxiosError } from 'axios';
import { URL } from '../data/Constants';
import { User } from '../interfaces/userData';
import axios from './axiosConfig';

export const getCheckAuth: Function = async (userId: string): Promise<User|undefined> => {
  try {
    const {data:{dbBack:userData}} = await axios.get(`${URL}/users/auth-check/${userId}`);
    return userData;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.log(err?.response?.status);
    } else {
      console.log('unexpected error ' + err);
    }
  }
};

export const getUser: Function = async (userId: string): Promise<unknown> => {
  try {
    const data = await axios.get(`${URL}/users/${userId}`);
    return data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.log(err?.response?.status);
    } else {
      console.log('unexpected error ' + err);
    }
  }
};
