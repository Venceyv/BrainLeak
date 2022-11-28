import { useMutation } from '@tanstack/react-query';
import { FC, useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import { postComment } from '../../../api/commentAPI';
import { queryClient } from '../../../main';
import './NewComment.css';
import 'react-quill/dist/quill.snow.css';

export const NewComment: FC<{ postId: string }> = ({ postId }): JSX.Element => {
  const [value, setValue] = useState<string>('');
  const postCommentMutation = useMutation(() => postComment(postId, value), {
    onSuccess: () => {
      setValue('');
      queryClient.invalidateQueries(['postComment']);
    },
  });

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
