import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { putLikeComment } from '../../../api/commentAPI';
import { queryClient } from '../../../main';
import { errorToast, successToast } from '../../../utils/errorToast';

export const useLikePinComment = (
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
        queryClient.invalidateQueries(['postCommentReply']);
        queryClient.invalidateQueries(['postData']);
      },
      onError: (err: AxiosError) => {
        if (err?.response?.status === 401) {
          errorToast('Please Login First');
        } else {
          errorToast('An error has occurred');
        }
      },
    }
  );

  return { putLikeMutation };
};
