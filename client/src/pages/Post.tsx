import { FC } from 'react';
import { PostAuthor } from '../feature/PostAuthor';
import { UserPost } from '../feature/UserPost';
import { Comment } from '../feature/Comment';
import { NewComment } from '../feature/UserPost/components/NewComment';

export const Post: FC = (): JSX.Element => {
  return (
    <div className="absolute flex items-center justify-center top-0 w-full z-10 bg-primary-black">
      <div className="w-full max-w-[1024px] z-10 bg-post-bg-black">
        <div className="flex flex-col justify-center w-full h-[calc(100%-56px)]">
          <div className="relative flex flex-row w-full max-w-[1024px] h-full ">
            <UserPost />
            <PostAuthor />
          </div>
          <Comment />
        </div>
      </div>
    </div>
  );
};
