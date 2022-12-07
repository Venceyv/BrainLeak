import { FC, useState } from 'react';
import TimeAgo from 'react-timeago';
import { Author } from '../../../interfaces/user';
import { fallback } from '../../../utils/imgFallback';
import Popup from 'reactjs-popup';
import './PostMetaData.css';
import { UseMutationResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';

export const PostMetaData: FC<{
  author: Author;
  publishDate: string;
  isAuthor: boolean;
  deletePostMutation: UseMutationResult<
    void,
    AxiosError<unknown, any>,
    void,
    unknown
  >;
  postId: string;
}> = ({
  author,
  publishDate,
  isAuthor,
  deletePostMutation,
  postId,
}): JSX.Element => {
  const navigate = useNavigate();
  const [displayConfirmation, setDisplayConfirmation] =
    useState<boolean>(false);

  const onConfirmDelete = () => {
    deletePostMutation.mutate();
    setDisplayConfirmation(false);
  };

  return (
    <div className="flex gap-1">
      <img
        src={author?.avatar}
        onError={fallback}
        className="w-5 h-5 rounded-full border-2 border-border-black cursor-pointer"
        alt="user image"
      />
      <p className="truncate pl-[2px] pt-[3px] text-xs text-white">
        {author?.username}
      </p>
      <div className="ml-2 pt-[3px] h-[calc(100%-2px)] text-white">
        *
      </div>
      <TimeAgo
        className="text-xs pt-[2px] opacity-90 text-white"
        date={`${publishDate}`}
      />

      {isAuthor && (
        <div className="flex ml-auto gap-4">
          <img
            className="h-[27px] w-[22px] cursor-pointer"
            src="../../../assets/img/edit-post.svg"
            alt="Edit post"
            title="Edit post"
            onClick={() => navigate(`/post/edit/${postId}`)}
          />

          <Popup
            open={displayConfirmation}
            className="bg-opacity-90"
            trigger={
              <img
                src="../../../assets/img/delete.svg"
                alt="delete"
                className="ml-auto w-[27px] h-[27px] cursor-pointer"
                title="delete"
                onClick={() => setDisplayConfirmation(true)}
              />
            }
            onClose={() => setDisplayConfirmation(false)}
            onOpen={() => setDisplayConfirmation(true)}
            closeOnDocumentClick
            modal
          >
            <div className="flex flex-col gap-4 w-[320px]">
              <img
                src="../../../assets/img/confirmation.png"
                alt="confirmation image"
                className="w-[320px]"
              />
              <p className="text-2xl text-white">
                Wait! Are you sure you want to delete this post?
              </p>
              <div className="flex px-4 text-white ">
                <button
                  className="border-2 rounded-md p-1 transition-all ease-in-out hover:border-red-secondary hover:text-red-secondary border-border-black"
                  onClick={onConfirmDelete}
                >
                  For sure
                </button>
                <button
                  className="ml-auto border-2 rounded-md p-1 transition-all ease-in-out hover:border-red-secondary hover:text-red-secondary border-border-black"
                  onClick={() => setDisplayConfirmation(false)}
                >
                  Actually, no
                </button>
              </div>
            </div>
          </Popup>
        </div>
      )}
    </div>
  );
};
