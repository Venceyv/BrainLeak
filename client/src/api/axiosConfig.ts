import axios from 'axios';

const getRequestHeader: Function = (): { Authorization: string; 'Content-Type': string } => {
  const userItem:string = localStorage.getItem('jwt') as string;
  const token: string = (userItem != "undefined") ? JSON.parse(userItem) as string : '';
  return {
    'Content-Type': 'application/json',
    Authorization: `${token}`,
  };
};

axios.interceptors.request.use(
  (config) => {
    config.headers = getRequestHeader();
    console.log(config.headers)
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axios;
