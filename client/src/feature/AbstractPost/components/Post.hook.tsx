import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import {
  putDislikePost,
  putLikePost,
  putSavePost,
} from '../../../api/postAPI';
import { errorToast, successToast } from '../../../utils/errorToast';

export const usePutUserStatusMutation = (postId: string) => {
  const putLikeMutation = useMutation(() => putLikePost(postId), {
    onSuccess: () => {
      successToast('Successfully Liked');
    },
    onError: (err: AxiosError) => {
      console.log(err);
      if (err?.response?.status === 401) {
        errorToast('Please Login First');
      }
    },
  });

  const putDislikeMutation = useMutation(
    () => putDislikePost(postId),
    {
      onSuccess: () => {
        successToast('Successfully Disliked');
      },
      onError: (err: AxiosError) => {
        console.log(err);
        if (err?.response?.status === 401) {
          errorToast('Please Login First');
        }
      },
    }
  );

  const putSaveMutation = useMutation(() => putSavePost(postId), {
    onSuccess: () => {
      successToast('Successfully Saved');
    },
    onError: (err: AxiosError) => {
      console.log(err);
      if (err?.response?.status === 401) {
        errorToast('Please Login First');
      }
    },
  });

  return { putLikeMutation, putDislikeMutation, putSaveMutation };
};
