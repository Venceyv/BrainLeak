import axios from './axiosConfig';
import { URL } from '../data/Constants';

export const getCheckAuth: Function = async (userId:string):Promise<void> => {
    console.log(`${URL}/users/${userId}/auth-check`)
    return await axios.get(`${URL}/users/${userId}/auth-check`);
}

