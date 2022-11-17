import { AxiosError } from 'axios';
import { URL } from '../data/Constants';
import { User } from '../interfaces/user';
import axios from './axiosConfig';

export const getCheckAuth = async (userId: string): Promise<User> => {
  try {
    const {
      data: { dbBack: userData },
    } = await axios.get(`${URL}/users/auth-check/${userId}`);

    console.log(userData);
    return userData as User;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.log(err?.response?.status);
    } else {
      console.log('unexpected error ' + err);
    }

    throw err;
  }
};

export const getUser = async (userId: string): Promise<unknown> => {
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
