import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import {
  putDislikeComment,
  putLikeComment,
} from '../../../api/commentAPI';
import { queryClient } from '../../../main';
import { errorToast, successToast } from '../../../utils/errorToast';

export const useMutateUserComment = (
  postId: string,
  commentId: string
) => {
  const putLikeMutation = useMutation(
    ['putLikeCommentMutation'],
    () => putLikeComment(postId, commentId),
    {
      onSuccess: () => {
        successToast('Success');
        queryClient.invalidateQueries(['postComment']);
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
    ['putDislikeCommentMutation'],
    () => putDislikeComment(postId, commentId),
    {
      onSuccess: () => {
        successToast('Success');
        queryClient.invalidateQueries(['postComment']);
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
