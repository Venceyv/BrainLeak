import { FC } from 'react';
import { PostAuthor } from '../feature/PostAuthor';
import { UserPost } from '../feature/UserPost';
import { Comment } from '../feature/Comment';
import { NewComment } from '../feature/UserPost/components/NewComment';
import { useQuery } from '@tanstack/react-query';
import { getPost } from '../api/postAPI';
import { useParams } from 'react-router-dom';
import { NotFound404 } from '../components/404';
import { PinnedComment } from '../feature/PinnedComment';

export const Post: FC = (): JSX.Element => {
  const { postId } = useParams();
  const { data, isLoading, isError } = useQuery(
    ['postData'],
    () => getPost(postId),
    { refetchOnWindowFocus: false, cacheTime: 0 }
  );

  if (isError) {
    return <NotFound404 />;
  }

  return (
    <div
      id="scroll-target-node"
      className="fixed inset-0 right-0 mt-[56px] flex items-center justify-center w-full z-10 h-[calc(100%-56px)] bg-primary-black overflow-auto"
    >
      <div className=" absolute top-0 w-full h-full max-w-[1024px] z-10 bg-post-bg-black">
        <div className="flex flex-row">
          <div className="flex flex-col justify-center max-w-[702] w-full bg-post-bg-black">
            <div className=" flex flex-row w-full max-w-[1024px]">
              <UserPost />
            </div>
            <Comment />
          </div>
          <div className="bg-post-bg-black">
            <PostAuthor />
            <PinnedComment />
          </div>
        </div>
      </div>
    </div>
  );
};
