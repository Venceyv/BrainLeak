import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import {
  putDislikePost,
  putLikePost,
  putSavePost,
} from '../../../api/postAPI';
import { queryClient } from '../../../main';
import { errorToast, successToast } from '../../../utils/errorToast';

export const usePutUserStatusOnPostMutation = (postId: string) => {
  const putLikeMutation = useMutation(
    ['putLikeOnPost'],
    () => putLikePost(postId),
    {
      onSuccess: () => {
        successToast('Success');
        queryClient.invalidateQueries(['postData']);
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
    ['putDislikeOnPost'],
    () => putDislikePost(postId),
    {
      onSuccess: () => {
        successToast('Success');
        queryClient.invalidateQueries(['postData']);
      },
      onError: (err: AxiosError) => {
        console.log(err);
        if (err?.response?.status === 401) {
          errorToast('Please Login First');
        }
      },
    }
  );

  const putSaveMutation = useMutation(
    ['putSaveOnPost'],
    () => putSavePost(postId),
    {
      onSuccess: () => {
        successToast('Success');
        queryClient.invalidateQueries(['postData']);
      },
      onError: (err: AxiosError) => {
        console.log(err);
        if (err?.response?.status === 401) {
          errorToast('Please Login First');
        }
      },
    }
  );

  return { putLikeMutation, putDislikeMutation, putSaveMutation };
};
