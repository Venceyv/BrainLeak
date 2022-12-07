import { useQueries, useQuery } from '@tanstack/react-query';
import { FC, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPost } from '../../api/postAPI';
import { getCheckAuth, getCheckAuthAuthor } from '../../api/userAPI';
import { getUserId } from '../../utils/getLocalStorage';
import { PostContent } from './components/PostContent';

export const UserPost: FC = (): JSX.Element => {
  const { postId } = useParams();
  const { data, isSuccess, isLoading, isError } = useQuery(
    ['postData'],
    () => getPost(postId),
    { refetchOnWindowFocus: false, cacheTime: 0 }
  );
  // const result = useQueries({
  //   queries: [
  //     {
  //       queryKey: ['postData'],
  //       queryFn: () => getPost(postId),
  //       cacheTime: 0,
  //       refetchOnWindowFocus: false,
  //     },
  //     {
  //       queryKey: ['checkAuthAuthor'],
  //       queryFn: () => getCheckAuthAuthor(getUserId()),
  //       refetchOnWindowFocus: false,
  //       cacheTime: 0,
  //     },
  //   ],
  // });
  if (isSuccess) {
    console.log(data);
  }

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
