import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import {
  putDislikePost,
  putLikePost,
  putSavePost,
} from '../../../api/postAPI';
import { queryClient } from '../../../main';
import { errorToast, successToast } from '../../../utils/errorToast';

export const usePutUserStatusMutation = (postId: string) => {
  const putLikeMutation = useMutation(
    ['putLikeAbstractPost'],
    () => putLikePost(postId),
    {
      onSuccess: () => {
        successToast('Success');
        queryClient.invalidateQueries(['posts']);
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
    ['putDislikeAbstractPost'],
    () => putDislikePost(postId),
    {
      onSuccess: () => {
        successToast('Success');
        queryClient.invalidateQueries(['posts']);
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

  const putSaveMutation = useMutation(
    ['putSaveAbstractPost'],
    () => putSavePost(postId),
    {
      onSuccess: () => {
        successToast('Success');
        queryClient.invalidateQueries(['posts']);
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

  return { putLikeMutation, putDislikeMutation, putSaveMutation };
};
