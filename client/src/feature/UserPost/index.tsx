import { useQuery } from '@tanstack/react-query';
import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { getPost } from '../../api/postAPI';
import { PostContent } from './components/PostContent';

export const UserPost: FC = (): JSX.Element => {
  const { postId } = useParams();
  const { data, isLoading, isError } = useQuery(
    ['postData'],
    () => getPost(postId),
    { refetchOnWindowFocus: false, cacheTime: 0 }
  );
  return (
    <div className="flex h-full w-full">
      {!!data && (
        <div className="flex flex-col gap-2 w-full">
          <PostContent post={data} postId={postId!} />
        </div>
      )}
    </div>
  );
};
