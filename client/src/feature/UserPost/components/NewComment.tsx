import { useMutation } from '@tanstack/react-query';
import { FC, useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import './NewComment.css';
import 'react-quill/dist/quill.snow.css';
import {
  postComment,
  postUserReply,
  putEditComment,
} from '../../../api/commentAPI';
import { queryClient } from '../../../main';
import { AxiosError } from 'axios';
import { errorToast, successToast } from '../../../utils/errorToast';

export const NewComment: FC<{
  postId: string;
  commentId?: string;
  commentUserId?: string;
  isReply: boolean;
  isEdit?: boolean;
  content: string;
  setShowReply?: React.Dispatch<React.SetStateAction<boolean>>;
  setShowEdit?: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({
  postId,
  commentId,
  commentUserId,
  isReply,
  isEdit,
  content,
  setShowEdit,
  setShowReply,
}): JSX.Element => {
  const [value, setValue] = useState<string>(content);
  const postCommentFn = () => postComment(postId!, value);
  const commentReplyFn = () =>
    postUserReply(postId!, commentId!, commentUserId!, value);
  const editCommentFn = () =>
    putEditComment(postId, commentId!, value);

  useEffect(() => {
    console.log(commentId);
  });

  const postCommentMutation = useMutation(
    isReply ? commentReplyFn : postCommentFn,
    {
      onSuccess: () => {
        setValue('');
        successToast('Successfully posted');
        if (setShowReply) {
          setShowReply(false);
        }
        queryClient.invalidateQueries(['postComment']);
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

  const editMutation = useMutation(editCommentFn, {
    onSuccess: () => {
      setValue('');
      successToast('Successfully edited');
      if (setShowEdit) {
        setShowEdit(false);
      }
      queryClient.invalidateQueries(['postComment']);
      queryClient.invalidateQueries(['postCommentReply']);
    },
    onError: (err: AxiosError) => {
      console.log(err);
      if (err?.response?.status === 401) {
        errorToast('Unauthorized');
      } else {
        errorToast('An error has occurred');
      }
    },
  });

  const onComment = () => {
    if (!value) {
      errorToast("Comment can't be empty!");
      return;
    }
    isEdit ? editMutation.mutate() : postCommentMutation.mutate();
  };

  return (
    <>
      <div className="flex flex-col gap-2 p-2 border-2 text-white bg-secondary-black border-border-black rounded-md">
        <div>
          <ReactQuill
            placeholder={`Fyi, internet is not a lawless place ... \n不要手嗨了`}
            theme="snow"
            value={value}
            onChange={setValue}
          />
        </div>

        <button
          type="button"
          className="w-fit ml-auto pt-[2px] px-1 border-2 border-border-black rounded-lg hover:bg-white hover:text-secondary-black hover:border-secondary-black"
          onClick={onComment}
        >
          Comment!!
        </button>
      </div>
    </>
  );
};
