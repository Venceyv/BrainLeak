import axios from './axiosConfig';
import { URL } from '../data/Constants';
import { TrendingPost } from '../interfaces/post';

export const getTrendingPosts = async (): Promise<TrendingPost[]> => {
  const {
    data: { dbBack: trendingPost },
  } = await axios.get(`${URL}/posts/trending?q=8&type=trending`);
  return trendingPost as TrendingPost[];
};

// TODO: finish typing
export const getPosts = async (pageNum: number, pageSize: number, sortType: string = 'lastest') => {
  const {
    data: { dbBack: posts },
  } = await axios.get(`${URL}/posts?pagenumber=${pageNum}&pagesize=${pageSize}&type=posts&sort=${sortType}`);
  console.log(posts);
  return posts;
};
