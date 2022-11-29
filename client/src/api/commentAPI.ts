import axios from './axiosConfig';
import { URL } from '../data/Constants';
import { CommentReply, PostComment } from '../interfaces/comment';

export const getComments = async (
  postId: string,
  pageNumber: number
): Promise<PostComment[]> => {
  try {
    const {
      data: { dbBack: comments },
    } = await axios.get(
      `${URL}/posts/comments/${postId}?pagesize=10&pagenumber=${pageNumber}&sort=new`
    );
    return comments as PostComment[];
  } catch (err) {
    throw err;
  }
};

export const getReplies = async (
  postId: string,
  commentId: string,
  pageNumber: number
): Promise<CommentReply[]> => {
  try {
    const {
      data: { dbBack: replies },
    } = await axios.get(
      `${URL}/posts/comment/replies/${postId}/${commentId}?pagesize=2&pagenumber=${pageNumber}&sort=new`
    );
    return replies as CommentReply[];
  } catch (err) {
    throw err;
  }
};

export const postComment = async (postId: string, commentContent: string) => {
  try {
    const dbBack = await axios.post(`${URL}/posts/comment/${postId}`, {
      content: commentContent,
    });
  } catch (error) {
    throw error;
  }
};

export const postUserReply = async (
  postId: string,
  commentId: string,
  commentUserId: string,
  commentContent: string
) => {
  try {
    const dbBack = await axios.post(
      `${URL}/posts/comment/reply/${postId}/${commentId}/${commentUserId}`,
      {
        content: commentContent,
      }
    );
  } catch (error) {
    throw error;
  }
};
