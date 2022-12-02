import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import {
  putDislikeReply,
  putLikeReply,
} from '../../../api/commentAPI';
import { queryClient } from '../../../main';
import { errorToast, successToast } from '../../../utils/errorToast';

export const useMutateUserReply = (
  postId: string,
  commentId: string,
  replyId: string
) => {
  const putLikeMutation = useMutation(
    ['putLikeReply'],
    () => putLikeReply(postId, commentId, replyId),
    {
      onSuccess: () => {
        successToast('Success');
        queryClient.invalidateQueries(['postCommentReply']);
      },
      onError: (err: AxiosError) => {
        console.log(err);
        if (err?.response?.status === 401) {
          errorToast('Please Login First');
        }
      },
    }
  );

  const putDislikeMutation = useMutation(
    ['putDislikeReply'],
    () => putDislikeReply(postId, commentId, replyId),
    {
      onSuccess: () => {
        successToast('Success');
        queryClient.invalidateQueries(['postCommentReply']);
      },
      onError: (err: AxiosError) => {
        console.log(err);
        if (err?.response?.status === 401) {
          errorToast('Please Login First');
        }
      },
    }
  );

  return { putLikeMutation, putDislikeMutation };
};
