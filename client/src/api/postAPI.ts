import axios from './axiosConfig';
import { URL } from '../data/Constants';
import {
  IntervalItem,
  MenuItem,
  Post,
  Statistic,
  StatisticWithMark,
  TrendingPost,
  CommentSortByType,
} from '../interfaces/post';

export const getTrendingPosts = async (): Promise<TrendingPost[]> => {
  try {
    const {
      data: { dbBack: trendingPost },
    } = await axios.get(`${URL}/posts/trending?q=4&type=trending`);
    return trendingPost as TrendingPost[];
  } catch (error) {
    throw error;
  }
};

export const getPost = async (
  postId: string | undefined
): Promise<Post<StatisticWithMark>> => {
  try {
    const {
      data: { dbBack: postData },
    } = await axios.get(`${URL}/posts/${postId}`);
    return postData as Post<StatisticWithMark>;
  } catch (error) {
    throw error;
  }
};

export const deletePost = async (
  postId: string | undefined
): Promise<void> => {
  try {
    const {
      data: { dbBack: postData },
    } = await axios.delete(`${URL}/posts/${postId}`);
  } catch (error) {
    throw error;
  }
};

export const getPosts = async (
  pageNum: number,
  sortType: MenuItem,
  timeInterval: IntervalItem = 'allTime'
): Promise<Post<StatisticWithMark>[]> => {
  let interval;

  if (timeInterval !== 'allTime' && sortType !== 'new') {
    switch (timeInterval) {
      case 'today':
        interval = 'a_day';
        break;
      case 'week':
        interval = 'a_week';
        break;
      case 'month':
        interval = 'a_month';
        break;
      case 'year':
        interval = 'a_year';
        break;
    }
  }

  const queryUrl =
    sortType === 'new' || timeInterval === 'allTime'
      ? `${URL}/posts?pagenumber=${pageNum}&pagesize=10&type=posts&sort=${sortType}`
      : `${URL}/posts?pagenumber=${pageNum}&pagesize=10&type=posts&timeInterval=${interval}&sort=${sortType}`;

  try {
    const {
      data: { dbBack: posts },
    } = await axios.get(queryUrl);
    return posts as Post<StatisticWithMark>[];
  } catch (err) {
    throw err;
  }
};

export const putLikePost = async (postId: string): Promise<void> => {
  try {
    const {
      data: { dbBack: post },
    } = await axios.put(`${URL}/posts/like/${postId}`);
  } catch (err) {
    throw err;
  }
};

export const putDislikePost = async (
  postId: string
): Promise<void> => {
  try {
    const {
      data: { dbBack: post },
    } = await axios.put(`${URL}/posts/dislike/${postId}`);
  } catch (err) {
    throw err;
  }
};

export const putSavePost = async (postId: string): Promise<void> => {
  try {
    const {
      data: { dbBack: post },
    } = await axios.put(`${URL}/posts/save/${postId}`);
  } catch (err) {
    throw err;
  }
};

export const postCreatePost = async (
  title: string,
  body: string,
  tag: string[],
  notify: boolean
): Promise<void> => {
  try {
    await axios.post(`${URL}/posts?notify=${notify}`, {
      title: title,
      description: body,
      tag: tag,
    });
  } catch (err) {
    throw err;
  }
};
