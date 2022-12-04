import { AxiosError } from 'axios';
import { URL } from '../data/Constants';
import { TrendingUser, User } from '../interfaces/user';
import axios from './axiosConfig';

export const getCheckAuth = async (
  userId: string | null
): Promise<User> => {
  try {
    const {
      data: { dbBack: userData },
    } = await axios.get(`${URL}/users/auth-check/${userId}`);
    return userData as User;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err?.response?.status === 401) {
        localStorage.removeItem('userId');
        localStorage.removeItem('jwt');
      }
    } else {
      console.log('unexpected error ' + err);
    }

    throw err;
  }
};

export const getCheckAuthAuthor = async (
  userId: string | null
): Promise<User | null> => {
  try {
    const {
      data: { dbBack: userData },
    } = await axios.get(`${URL}/users/auth-check/${userId}`);
    return userData as User;
  } catch (error) {
    throw 'not author';
  }
};

export const getUser = async (userId: string): Promise<User> => {
  try {
    const {
      data: { dbBack: userData },
    } = await axios.get(`${URL}/users/${userId}`);
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

export const getUserTrending = async (): Promise<TrendingUser[]> => {
  try {
    const {
      data: { dbBack: topUsers },
    } = await axios.get(`${URL}/users/trending?top=5`);
    return topUsers as TrendingUser[];
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.log(err?.response?.status);
    } else {
      console.log('unexpected error ' + err);
    }
    throw err;
  }
};
