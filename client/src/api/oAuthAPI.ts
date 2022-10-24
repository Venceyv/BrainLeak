import { URL } from '../data/Constants';
import axios from './axiosConfig';

// google OAuth
export const postGoogleOAuth: Function = async (code: string): Promise<any> => {
  try {
    const { data } = await axios.post(`${URL}/auth/google`, {
      code,
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const postLogOut: Function = async (): Promise<any> => {
  try {
    const user = JSON.parse(localStorage.getItem('userInfo') as string);
    await axios.post(`${URL}/users/${user?._id}/logout`);
  } catch (error) {
    throw error;
  }
};
