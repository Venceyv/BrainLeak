import { FC } from 'react';

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

export const TrendingPost: FC<TrendingPostProp> = ({ popularity, post }): JSX.Element => {
  return (
    <div className="grid grid-cols-3 grid-rows-3 gap-2 py-3 overflow-hidden w-[260px] h-[160px] rounded-2xl p-3 pb-[0px] border-[1px] bg-secondary-black border-zinc-400 cursor-pointer">
      <h1 className="col-span-3 text-[14px] w-full h-[40px] line-clamp-2 break-words whitespace-normal font-black">{post.title}</h1>
      <p className="col-span-3 row-span-1 w-full h-[38px] text-[12px] line-clamp-2 break-words whitespace-normal">{post.description}</p>
      <div className="flex items-center justify-start gap-2 col-span-2">
        <img
          className="max-w-[36px] max-h-[36px] min-w-[36px] min-h-[36px] rounded-full border-[1px] cursor-pointer text-zinc-50"
          src={post.author?.avatar}
          alt="profile picture"
        />
        <p className="text-sm cursor-pointer truncate">{post.author?.username}</p>
      </div>
      <div className="flex pb-2 items-end justify-end gap-1">
        <img src="../../../assets/img/hot.svg" alt="trending" className="w-6" />
        <p className="h-fit truncate text-sm">{popularity}</p>
      </div>
      {/* </span> */}
    </div>
    // </div>
  );
};
