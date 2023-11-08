import { URL } from '../data/Constants';
import axios from './axiosConfig';

// google OAuth
export const postGoogleOAuth: Function = async (
  code: string
): Promise<any> => {
  try {
    const { data } = await axios.post(`${URL}/auth/google`, {
      code,
    });
    return data;
  } catch (error) {
    throw error;
  }
};

//TODO: remove userinfo store only id
export const postLogOut: Function = async (): Promise<any> => {
  try {
    const user = JSON.parse(localStorage.getItem('userId') as string);
    return await axios.post(`${URL}/users/logout/${user}`);
  } catch (error) {
    throw error;
  }
};
