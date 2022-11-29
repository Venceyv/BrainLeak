import { useMutation } from '@tanstack/react-query';
import { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark } from '../../../components/Bookmark';
import { DislikeThumb } from '../../../components/DislikeThumb';
import { LikeThumb } from '../../../components/LikeThumb';
import { Author } from '../../../interfaces/user';
import { convertDate } from '../../../utils/convertDate';
import { formatNumber } from '../../../utils/formatNumber';
import { usePutUserStatusMutation } from './Post.hook';

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
}

export const Post: FC<PostProp> = ({
  user,
  post,
  like,
  dislike,
  save,
}): JSX.Element => {
  const [isLiked, setIsLiked] = useState<boolean>(
    like ? true : false
  );
  const [isSaved, setIsSaved] = useState<boolean>(
    save ? true : false
  );

  const { putDislikeMutation, putLikeMutation, putSaveMutation } =
    usePutUserStatusMutation(post._id);
  return (
    <div className="flex grow shrink justify-start gap-3 py-4 max-w-[700px]">
      <div className="flex flex-col items-center justify-center gap-2">
        <img
          className="h-[50px] w-[50px] rounded-full border-2 cursor-pointer border-border-black  text-zinc-50"
          src={user?.avatar || ''}
          alt="user"
        />
        <p className="text-sm cursor-pointer w-[100px] text-center truncate">
          {user?.username}
        </p>
      </div>

      <div className="flex flex-col gap-2 grow shrink w-[558px] bg-secondary-black rounded-2xl p-3 pb-[1px] border-2 border-border-black cursor-pointer">
        <Link to={`/post/${post._id}`}>
          <h1 className="text-[14px] font-bold w-full truncate">
            {post?.title}
          </h1>
          <p className="text-[12px] overflow-hidden truncate w-full text-zinc-400">
            {post?.description}
          </p>
        </Link>
        <span className="flex flex-row gap-3 text-xs pb-1 w-full">
          <div
            className="flex"
            onClick={() => putLikeMutation.mutate()}
          >
            {/* <img
                src="../../../assets/img/like.svg"
                className="w-5 h-5"
                alt="like"
              /> */}
            <LikeThumb isTrue={isLiked} />
            <p className="truncate pl-[2px] pt-[2px]">
              Like: {formatNumber(post?.like)}
            </p>
          </div>
          <div
            className="flex"
            onClick={() => putDislikeMutation.mutate()}
          >
            <DislikeThumb isTrue={dislike ? true : false} />
            <p className="truncate pl-[2px] pt-[2px]">
              Dislike: {formatNumber(post?.dislike)}
            </p>
          </div>
          <div
            className="flex"
            onClick={() => putSaveMutation.mutate()}
          >
            <Bookmark isTrue={isSaved} />
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
  );
};

export default Post;
