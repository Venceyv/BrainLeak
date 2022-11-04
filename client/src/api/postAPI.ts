import axios from './axiosConfig';
import { URL } from '../data/Constants';

export const getPosts = async () => {
    const data = await axios.get(`${URL}/posts?pagenumber=1}`)
    console.log(data)
}