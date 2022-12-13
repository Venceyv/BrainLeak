import { useMutation } from '@tanstack/react-query';
import { FC, useState } from 'react';
import ReactQuill from 'react-quill';
import { Link, useNavigate } from 'react-router-dom';
import { Bookmark } from '../../../components/Bookmark';
import { DislikeThumb } from '../../../components/DislikeThumb';
import { LikeThumb } from '../../../components/LikeThumb';
import { Author } from '../../../interfaces/user';
import { convertDate } from '../../../utils/convertDate';
import { formatNumber } from '../../../utils/formatNumber';
import { fallback } from '../../../utils/imgFallback';
import { ellipsisText } from '../../../utils/clipText';
import './MyPostWithCover.css';

interface PostProp {
  user: Author;
  post: {
    title: string;
    description: string;
    like: number;
    dislike: number;
    date: string;
    _id: string;
    marks: number;
  };

  like: boolean | undefined;
  dislike: boolean | undefined;
  save: boolean | undefined;
  cover: string | undefined;
  useAvatar: boolean;
}

export const MyPostWithCover: FC<PostProp> = ({
  user,
  post,
  like,
  dislike,
  save,
  cover,
  useAvatar,
}): JSX.Element => {
  const navigate = useNavigate();
  return (
    <div className="flex grow shrink justify-start gap-3 py-4 max-w-[700px] text-white">
      {useAvatar && (
        <div className="flex flex-col items-center justify-center gap-2">
          <img
            className="h-[50px] w-[50px] rounded-full border-2 cursor-pointer border-border-black  text-zinc-50"
            src={user?.avatar}
            onError={fallback}
            alt="user"
            onClick={() => navigate(`/user/profile/${user._id}`)}
          />
          <p
            className="text-sm cursor-pointer w-[100px] text-center truncate"
            onClick={() => navigate(`/user/profile/${user._id}`)}
          >
            {user?.username}
          </p>
        </div>
      )}

      <div className="flex flex-row gap-2 grow shrink w-[558px] text-white bg-secondary-black rounded-lg p-1 px-2 border-2 border-border-black cursor-pointer">
        {cover && (
          <ReactQuill
            theme="bubble"
            value={cover}
            readOnly
            className="post-picture"
          />
        )}

        <div className="flex flex-col h-full w-full">
          <Link to={`/post/${post._id}`}>
            <h1 className="text-[14px] font-bold w-full line-clamp-2 h-[42px] mt-2">
              {post?.title}
            </h1>
            {!cover && (
              <div className="text-[12px] truncate w-full cursor-pointer text-zinc-400">
                <ReactQuill
                  theme="bubble"
                  value={post?.description}
                  readOnly
                  className="abstract"
                />
              </div>
            )}
          </Link>
          <span
            className={`flex flex-row gap-3 text-xs mt-auto ${
              !cover ? 'pb-1' : ''
            } w-full`}
          >
            <div className="flex">
              {/* <img
                src="../../../assets/img/like.svg"
                className="w-5 h-5"
                alt="like"
              /> */}
              <LikeThumb isTrue={like ? true : false} />
              <p className="truncate pl-[2px] pt-[2px]">
                Like: {formatNumber(post?.like)}
              </p>
            </div>
            <div className="flex">
              <DislikeThumb isTrue={dislike ? true : false} />
              <p className="truncate pl-[2px] pt-[2px]">
                Dislike: {formatNumber(post?.dislike)}
              </p>
            </div>
            <div className="flex">
              <Bookmark isTrue={save ? true : false} />
              <p className="truncate pl-[2px] pt-[2px]">
                Bookmark: {formatNumber(post?.marks)}
              </p>
            </div>
            <p className="ml-auto truncate">
              {convertDate(post?.date)}
            </p>
          </span>
        </div>
      </div>
    </div>
  );
};
