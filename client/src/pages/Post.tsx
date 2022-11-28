import { FC } from 'react';
import { PostAuthor } from '../feature/PostAuthor';
import { UserPost } from '../feature/UserPost';
import { Comment } from '../feature/Comment';
import { NewComment } from '../feature/UserPost/components/NewComment';

export const Post: FC = (): JSX.Element => {
  return (
    <div className="fixed inset-0 right-0 mt-[56px] flex items-center justify-center w-full z-10 h-[calc(100%-56px)] bg-primary-black overflow-auto">
      <div className=" absolute top-0 w-full h-full max-w-[1024px] z-10 bg-post-bg-black">
        <div className="flex flex-col justify-center w-full bg-post-bg-black">
          <div className="relative flex flex-row w-full max-w-[1024px]">
            <UserPost />
            <PostAuthor />
          </div>
          <Comment />
        </div>
      </div>
    </div>
  );
};

// TODO: POST VALIDATOR
// TODO: FIX POST OVERLAY
// TODO: CHECK PARAM FOR MAIN, IF HAS PARAM, SET OVERFLOW NONE TO FIX OVERLAY
