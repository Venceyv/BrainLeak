import { useMutation } from '@tanstack/react-query';
import { FC, useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import './NewComment.css';
import 'react-quill/dist/quill.snow.css';
import { postComment, postReply } from '../../../api/commentAPI';
import { queryClient } from '../../../main';
import { AxiosError } from 'axios';
import { errorToast, successToast } from '../../../utils/errorToast';

export const NewComment: FC<{
  postId: string;
  commentId?: string;
  isReply: boolean;
  setShowReply?: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ postId, commentId, isReply, setShowReply }): JSX.Element => {
  const [value, setValue] = useState<string>('');
  const postCommentFn = () => postComment(postId!, value);
  const commentReplyFn = () => postReply(postId!, commentId!, value);

  const postCommentMutation = useMutation(
    isReply ? commentReplyFn : postCommentFn,
    {
      onSuccess: () => {
        setValue('');
        successToast('Successfully posted');
        if (setShowReply) {
          setShowReply(false);
        }
        queryClient.invalidateQueries(['postComment', 'postCommentReply']);
        queryClient.refetchQueries(['postComment', 'postCommentReply']);
      },
      onError: (err: AxiosError) => {
        console.log(err);
        if (err?.response?.status === 401) {
          errorToast('Please Login First');
        }
      },
    }
  );

  return (
    <>
      <div className="flex flex-col gap-2 p-2 border-2 text-white bg-secondary-black border-border-black rounded-md">
        <div>
          <ReactQuill theme="snow" value={value} onChange={setValue} />
        </div>

        <button
          type="button"
          className="w-fit ml-auto pt-[2px] px-1 border-2 border-border-black rounded-lg hover:bg-white hover:text-secondary-black hover:border-secondary-black"
          onClick={() => postCommentMutation.mutate()}
        >
          Comment!!
        </button>
      </div>
    </>
  );
};
