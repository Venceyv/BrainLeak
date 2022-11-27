import axios from './axiosConfig';
import { URL } from '../data/Constants';
import { PostComment } from '../interfaces/comment';

export const getComments = async (postId: string): Promise<PostComment[]> => {
  try {
    const {
      data: { dbBack: comments },
    } = await axios.get(`${URL}/posts/comments/${postId}`, {
      params: { pagenumber: 1, pagesize: 10, sort: 'lastest' },
    });
    console.log(comments);
    return comments as PostComment[];
  } catch (err) {
    throw err;
  }
};

export const postComment = async (postId: string, commentContent: string) => {
  try {
    const dbBack = await axios.post(`${URL}/posts/comment/${postId}`, {
      content: commentContent,
    });

    console.log(dbBack);
  } catch (error) {
    throw error;
  }
};
