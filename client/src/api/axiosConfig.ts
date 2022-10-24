import axios from 'axios';

const getRequestHeader: Function = (): { Authorization: string; 'Content-Type': string } => {
  const token: string = JSON.parse(localStorage.getItem('jwt') as string);
  return {
    'Content-Type': 'application/json',
    Authorization: `${token ? token : ''}`,
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
