import { useQuery } from '@tanstack/react-query';
import { FC, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPost } from '../../api/postAPI';
import { getCheckAuthAuthor } from '../../api/userAPI';
import { getUserId } from '../../utils/getLocalStorage';
import { Pinned } from './components/pinned';

export const PinnedComment: FC = (): JSX.Element => {
  const { postId } = useParams();
  const { data, isSuccess, isError } = useQuery(
    ['postData'],
    () => getPost(postId),
    { refetchOnWindowFocus: false, cacheTime: 0 }
  );

  return (
    <>
      {data?.pinnedComment != null && (
        <div className="absolute flex justify-center h-full w-[270px] mt-10 text-white ">
          <Pinned
            pinnedComment={
              data?.pinnedComment ? data.pinnedComment : null
            }
            postId={postId!}
          />
        </div>
      )}
    </>
  );
};
