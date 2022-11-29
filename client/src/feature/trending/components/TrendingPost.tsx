import { FC } from 'react';
import { Link } from 'react-router-dom';

interface TrendingPostProp {
  popularity: number;
  post: {
    author: {
      avatar: string;
      username: string;
      _id: string;
    };
    title: string;
    description: string;
    _id: string;
  };
}

export const TrendingPost: FC<TrendingPostProp> = ({
  popularity,
  post,
}): JSX.Element => {
  return (
    <Link to={`post/${post._id}`}>
      <div className="grid grid-cols-3 grid-rows-3 gap-2 py-3 overflow-hidden w-[250px] h-[160px] rounded-2xl p-3 pb-1 border-2 bg-secondary-black border-border-black cursor-pointer">
        <h1 className="col-span-3 text-[14px] w-full h-[40px] line-clamp-2 break-words whitespace-normal font-[800]">
          {post.title}
        </h1>
        <p className="col-span-3 row-span-1 w-full h-9 text-[12px] line-clamp-2 break-words whitespace-normal">
          {post.description}
        </p>
        <div className="flex items-center justify-start gap-2 col-span-2">
          <img
            className="w-[37px] h-[37px] rounded-full border-2 cursor-pointer border-border-black text-zinc-50"
            src={post.author?.avatar}
            alt="profile picture"
          />
          <p className="text-sm cursor-pointer truncate">
            {post.author?.username}
          </p>
        </div>
        <div className="flex pb-2 items-end justify-end gap-1">
          <img
            src="../../../assets/img/hot.svg"
            alt="trending"
            className="w-6"
          />
          <p className="h-fit truncate text-sm">{popularity}</p>
        </div>
      </div>
    </Link>
  );
};
