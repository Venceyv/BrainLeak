import axios from './axiosConfig';
import { URL } from '../data/Constants';
import { CommentReply, PostComment } from '../interfaces/comment';

export const getComments = async (
  postId: string,
  pageNumber: number,
  sortBy: string
): Promise<PostComment[]> => {
  try {
    const {
      data: { dbBack: comments },
    } = await axios.get(
      `${URL}/posts/comments/${postId}?pagesize=10&pagenumber=${pageNumber}&sort=${sortBy}`
    );
    console.log(comments);
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

export const postComment = async (
  postId: string,
  commentContent: string
) => {
  try {
    const dbBack = await axios.post(
      `${URL}/posts/comment/${postId}`,
      {
        content: commentContent,
      }
    );
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

export const putLikeComment = async (
  postId: string,
  commentId: string
): Promise<void> => {
  try {
    const {
      data: { dbBack: comment },
    } = await axios.put(`${URL}/posts/like/${postId}/${commentId}`);
  } catch (err) {
    throw err;
  }
};

export const putDislikeComment = async (
  postId: string,
  commentId: string
): Promise<void> => {
  try {
    const {
      data: { dbBack: comment },
    } = await axios.put(
      `${URL}/posts/dislike/${postId}/${commentId}`
    );
  } catch (err) {
    throw err;
  }
};

export const putLikeReply = async (
  postId: string,
  commentId: string,
  replyId: string
): Promise<void> => {
  try {
    const {
      data: { dbBack: reply },
    } = await axios.put(
      `${URL}/posts/like/${postId}/${commentId}/${replyId}`
    );
  } catch (err) {
    throw err;
  }
};

export const putDislikeReply = async (
  postId: string,
  commentId: string,
  replyId: string
): Promise<void> => {
  try {
    const {
      data: { dbBack: reply },
    } = await axios.put(
      `${URL}/posts/dislike/${postId}/${commentId}/${replyId}`
    );
  } catch (err) {
    throw err;
  }
};
