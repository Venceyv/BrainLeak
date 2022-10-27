import axios from 'axios';
import { getJWT } from '../utils/getLocalStorage';

export const getRequestHeader: Function = (): { 'Content-Type': string; Authorization: string } => {
  const token: string = getJWT();
  return {
    'Content-Type': 'application/json',
    Authorization: `${token}`,
  };
};

axios.interceptors.request.use(
  (config) => {
    config.headers = getRequestHeader();
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axios;
