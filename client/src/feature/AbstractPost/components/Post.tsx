import { FC } from 'react';
import { Author } from '../../../interfaces/post';

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
    <div className="flex grow shrink justify-start gap-3 py-4 max-w-[670px]">
      <div className="flex flex-col items-center justify-center gap-2">
        <img className="h-[37px] w-[37px] rounded-full border-2 cursor-pointer border-border-black  text-zinc-50" src={user.avatar || ''} alt="user" />
        <p className="text-sm cursor-pointer w-[100px] text-center truncate">{user.username}</p>
      </div>

      <div className="flex flex-col gap-2 grow shrink w-[558px] bg-secondary-black rounded-2xl p-3 pb-[1px] border-2 border-border-black cursor-pointer">
        <h1 className="text-[14px] font-bold w-full truncate">{post.title}</h1>
        <p className="text-[12px] overflow-hidden truncate w-full text-zinc-400">{post.description}</p>
        <span className="flex flex-row gap-2 text-[11px] pb-1 w-full">
          <p className="overflow-hidden truncate">Like: {post.like}</p>
          <p className="overflow-hidden truncate">Dislike: {post.dislike}</p>
          <p className="ml-auto overflow-hidden truncate">{post.date}</p>
        </span>
      </div>
    </div>
  );
};

export default Post;
