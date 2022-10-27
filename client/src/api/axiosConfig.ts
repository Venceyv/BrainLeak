import axios from 'axios';

export const getRequestHeader: Function = (): { 'Content-Type': string; Authorization: string } => {
  const userItem: string = JSON.parse(localStorage.getItem('jwt') as string);
  // const token: string = (userItem != "undefined") ? JSON.parse(userItem) as string : '';
  return {
    'Content-Type': 'application/json',
    Authorization: `${userItem}`,
  };
};

axios.interceptors.request.use(
  (config) => {
    config.headers = getRequestHeader();
    console.log(config.headers);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axios;
