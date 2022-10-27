import axios from 'axios';

const getRequestHeader: Function = (): { Authorization: string; 'Content-Type': string } => {
  const userItem:string = JSON.parse(localStorage.getItem('jwt') as string);
  // const token: string = (userItem != "undefined") ? JSON.parse(userItem) as string : '';
  return {
    'Content-Type': 'application/json',
    Authorization: `${userItem}`,
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
