import { FC } from 'react';
import { PostAuthor } from '../feature/PostAuthor';
import { UserPost } from '../feature/UserPost';
import { Comment } from '../feature/Comment';
import { NewComment } from '../feature/UserPost/components/NewComment';

export const Post: FC = (): JSX.Element => {
  return (
    <div className="absolute top-0 w-full max-w-[1024px] z-10">
      <div className="flex flex-col justify-center w-full h-[calc(100%-56px)]">
        <div className="relative flex flex-row w-full max-w-[1024px] h-full bg-[#161616]">
          <UserPost />
          <PostAuthor />
        </div>
      </div>
    </div>
  );
};
