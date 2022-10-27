<<<<<<< HEAD
import axios from './axiosConfig';
import { URL } from '../data/Constants';

export const getCheckAuth: Function = async (userId:string):Promise<void> => {
    console.log(`${URL}/users/${userId}/auth-check`)
    return await axios.get(`${URL}/users/${userId}/auth-check`);
}

=======
import { URL } from '../data/Constants';
import axios, { getRequestHeader } from './axiosConfig';

export const getCheckAuth: Function = async (userId: string): Promise<unknown> => {
  try {
    const data = await axios.get(`${URL}/users/auth-check/${userId}`);
    console.log('check auth data', data)
    return data;
  }catch (err) {
    return undefined;
  }
};

export const getUser: Function = async (userId:string): Promise<unknown> => {
  const data = await axios.get(`${URL}/users/${userId}`)
  console.log('get user data', data)
  return data
}
>>>>>>> login-persistent
