import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import {
  putDislikeReply,
  putLikeReply,
} from '../../../api/commentAPI';
import { CommentReply } from '../../../interfaces/comment';
import { queryClient } from '../../../main';
import { errorToast, successToast } from '../../../utils/errorToast';

export const useMutateUserReply = (
  postId: string,
  commentId: string,
  replyId: string,
  setCommentReply: React.Dispatch<React.SetStateAction<CommentReply>>
) => {
  const putLikeMutation = useMutation(
    ['putLikeReply'],
    () => putLikeReply(postId, commentId, replyId),
    {
      onSuccess: (data) => {
        successToast('Success');
        setCommentReply({ ...data });
        // queryClient.invalidateQueries(['postComment']);
        queryClient.invalidateQueries(['postCommentReply']);
      },
      onError: (err: AxiosError) => {
        console.log(err);
        if (err?.response?.status === 401) {
          errorToast('Please Login First');
        } else {
          errorToast('An error has occurred');
        }
      },
    }
  );

  const putDislikeMutation = useMutation(
    ['putDislikeReply'],
    () => putDislikeReply(postId, commentId, replyId),
    {
      onSuccess: (data) => {
        successToast('Success');
        setCommentReply({ ...data });
        // queryClient.invalidateQueries(['postComment']);
        queryClient.invalidateQueries(['postCommentReply']);
      },
      onError: (err: AxiosError) => {
        console.log(err);
        if (err?.response?.status === 401) {
          errorToast('Please Login First');
        } else {
          errorToast('An error has occurred');
        }
      },
    }
  );

  return { putLikeMutation, putDislikeMutation };
};
