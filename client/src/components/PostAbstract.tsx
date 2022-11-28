import { FC } from 'react';

// TODO: add post interface on api && move to interface folder
interface PostAbstractProp {
  user: {
    userName: string;
    profileUrl: string;
  };
  post: {
    title: string;
    description: string;
    likeCount: number;
    dislikeCount: number;
    date: string;
  };
}

export const PostAbstract: FC<PostAbstractProp> = ({
  user,
  post,
}): JSX.Element => {
  return (
    <div className="flex justify-center gap-3 py-4">
      <div className="flex flex-col items-center justify-center">
        <img
          className="max-w-[36px] max-h-[36px] min-w-[36px] min-h-[36px] rounded-full border-[1px] cursor-pointer text-zinc-50"
          src="../../assets/img/testUserPic.jpeg"
          alt="user"
        />
        <p className="text-sm cursor-pointer overflow-ellipsis">
          {user.userName}
        </p>
      </div>

      <div className="flex flex-col bg-secondary-black w-[300px] rounded-2xl p-3 pb-[1px] border-[1px] border-zinc-400 cursor-pointer">
        <h1 className="text-[14px] font-bold w-full overflow-hidden truncate">
          {post.title}
        </h1>
        <p className="text-[12px] overflow-hidden truncate w-full text-zinc-400">
          {post.description}
        </p>
        <span className="flex flex-row gap-2 text-[11px] pt-3">
          <p className="overflow-hidden truncate">Like: {post.likeCount}</p>
          <p className="overflow-hidden truncate">
            Dislike: {post.dislikeCount}
          </p>
          <p className="ml-auto overflow-hidden truncate">{post.date}</p>
        </span>
      </div>
    </div>
  );
};

export default PostAbstract;
