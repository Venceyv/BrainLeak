import axios from 'axios';
import { URL } from '../data/Constants';
import { getRequestHeader } from './axiosConfig';

axios.interceptors.request.use(
  (config) => {
    console.log('heyhey');
    config.headers = getRequestHeader();
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getCheckAuth: Function = async (userId: string): Promise<void> => {
  console.log(`users/${userId}/auth-check`);
  const data = await axios.get(`${URL}/posts/tags`);
  console.log(data);
};
