import { FC } from 'react';
import { Link } from 'react-router-dom';
import { Author } from '../../../interfaces/post';
import { convertDate } from '../../../utils/convertDate';
import { formatNumber } from '../../../utils/formatNumber';

// TODO: add post interface on api && move to interface folder
interface PostProp {
  user: Author;
  post: {
    title: string;
    description: string;
    like: number;
    dislike: number;
    date: string;
    _id: string;
  };
}

export const Post: FC<PostProp> = ({ user, post }): JSX.Element => {
  return (
    <div className="flex grow shrink justify-start gap-3 py-4 max-w-[700px]">
      <div className="flex flex-col items-center justify-center gap-2">
        <img
          className="h-[50px] w-[50px] rounded-full border-2 cursor-pointer border-border-black  text-zinc-50"
          src={user?.avatar || ''}
          alt="user"
        />
        <p className="text-sm cursor-pointer w-[100px] text-center truncate">{user?.username}</p>
      </div>

      <Link to={`/post/${post._id}`}>
        <div className="flex flex-col gap-2 grow shrink w-[558px] bg-secondary-black rounded-2xl p-3 pb-[1px] border-2 border-border-black cursor-pointer">
          <h1 className="text-[14px] font-bold w-full truncate">{post?.title}</h1>
          <p className="text-[12px] overflow-hidden truncate w-full text-zinc-400">{post?.description}</p>
          <span className="flex flex-row gap-2 text-xs pb-1 w-full">
            <div className="flex">
              <img src="../../../assets/img/like.svg" className="w-5 h-5" alt="like" />
              <p className="truncate pl-[2px] pt-[2px]">Like: {formatNumber(post?.like)}</p>
            </div>
            <div className="flex">
              <img src="../../../assets/img/dislike.svg" className="w-5 h-5" alt="dislike" />
              <p className="truncate pl-[2px] pt-[2px]">Dislike: {formatNumber(post?.dislike)}</p>
            </div>
            <p className="ml-auto truncate">{convertDate(post?.date)}</p>
          </span>
        </div>
      </Link>
    </div>
  );
};

export default Post;
