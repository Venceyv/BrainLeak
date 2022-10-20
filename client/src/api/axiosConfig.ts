import axios from 'axios';
import { URL } from '../data/Constants';

const getRequestHeader: Function = (): { Authorization: string; 'Content-Type': string } => {
  const token: string = JSON.parse(localStorage.getItem('jwt') as string);
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token ? token : ''}`,
  };
};

//TODO interceptor

export const axiosInstance = axios.create({
  baseURL: URL,
  timeout: 3000,
  headers: getRequestHeader(),
});
