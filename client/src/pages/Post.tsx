import { FC } from 'react';
import { PostAuthor } from '../feature/PostAuthor';
import { UserPost } from '../feature/UserPost';

export const Post: FC = (): JSX.Element => {
  return (
    <div className="flex justify-center w-full h-[calc(100%-56px)]">
      <div className="relative flex flex-row w-full max-w-[1024px] h-full bg-black bg-opacity-30">
        <UserPost />
        {/* <TopUser /> */}
        <PostAuthor />
      </div>
    </div>
  );
};
