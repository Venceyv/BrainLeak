import axios from './axiosConfig';
import { URL } from '../data/Constants';
import {
  IntervalItem,
  MenuItem,
  PostSearchResult,
} from '../interfaces/post';

export const getSearch = async (
  pageNum: number,
  sortType: MenuItem,
  queryParam: string
): Promise<PostSearchResult[]> => {
  try {
    const {
      data: { dbBack: searchResult },
    } = await axios.get(
      `${URL}/posts/search?type=posts&sort=${sortType}&pagesize=10&pagenumber=${pageNum}&q=${queryParam}`
    );
    return searchResult as PostSearchResult[];
  } catch (error) {
    throw error;
  }
};
