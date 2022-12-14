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
        throw '401';
      }
    } else {
      console.log('unexpected error ' + err);
    }

    throw err;
  }
};

export const getCheckAuthAuthor = async (
  userId: string | null
): Promise<User> => {
  try {
    const {
      data: { dbBack: userData },
    } = await axios.get(`${URL}/users/auth-check/${userId}`);
    return userData as User;
  } catch (error) {
    throw 'Not author';
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

export const putFollowUser = async (
  userId: string
): Promise<void> => {
  try {
    const {
      data: { dbBack: topUsers },
    } = await axios.put(`${URL}/users/follow/${userId}`);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.log(err?.response?.status);
    } else {
      console.log('unexpected error ' + err);
    }
    throw err;
  }
};

export const putUserAvatar = async (
  userId: string,
  file: any
): Promise<void> => {
  console.log(file);
  try {
    const {
      data: { dbBack: topUsers },
    } = await axios.put(`${URL}/users/avatar/${userId}`, file);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.log(err?.response?.status);
    } else {
      console.log('unexpected error ' + err);
    }
    throw err;
  }
};

export const putUserBackground = async (
  userId: string,
  file: any
): Promise<void> => {
  console.log(file);
  try {
    const {
      data: { dbBack: topUsers },
    } = await axios.put(
      `${URL}/users/backgroundCover/${userId}`,
      file
    );
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.log(err?.response?.status);
    } else {
      console.log('unexpected error ' + err);
    }
    throw err;
  }
};

export const putUser = async (
  userId: string,
  userInfo: any
): Promise<void> => {
  try {
    const {
      data: { dbBack: topUsers },
    } = await axios.put(`${URL}/users/${userId}`, userInfo);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.log(err?.response?.status);
    } else {
      console.log('unexpected error ' + err);
    }
    throw err;
  }
};

export const getUserFollowers = async (
  userId: string,
  pageNum: number
): Promise<User[]> => {
  try {
    const {
      data: { dbBack: followers },
    } = await axios.get(
      `${URL}/users/followerList/${userId}?pagenumber=${pageNum}&pagesize=10`
    );
    return followers as User[];
  } catch (err) {
    throw err;
  }
};

export const getUserFollowing = async (
  userId: string,
  pageNum: number
): Promise<User[]> => {
  try {
    const {
      data: { dbBack: followings },
    } = await axios.get(
      `${URL}/users/followingList/${userId}?pagenumber=${pageNum}&pagesize=10`
    );
    return followings as User[];
  } catch (err) {
    throw err;
  }
};
