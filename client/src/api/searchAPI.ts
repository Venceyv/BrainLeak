import axios from './axiosConfig';
import { URL } from '../data/Constants';
import { PostSearchResult } from '../interfaces/post';

export const getSearch = async (queryParam:string, pageNum: number):Promise<PostSearchResult[]> => {
    try {
        const {data:{dbBack : searchResult }} = await axios.get(`${URL}/posts/search?type=posts&sort=likes&pagesize=10&pagenumber=${pageNum}&q=${queryParam}`)
        return searchResult as PostSearchResult[]
    } catch (error) {
        throw error
    }
}