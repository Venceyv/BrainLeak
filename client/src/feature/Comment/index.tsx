import { useQuery } from '@tanstack/react-query';
import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { getPost } from '../../api/postAPI';
import { getCheckAuthAuthor } from '../../api/userAPI';
import { getUserId } from '../../utils/getLocalStorage';
import { NewComment } from '../UserPost/components/NewComment';
import { Comments } from './components/Comments';
import { IndividualComment } from './components/IndividualComment';

export const Comment: FC = (): JSX.Element => {
  const { postId } = useParams();

  const { data } = useQuery(['postData'], () => getPost(postId), {
    refetchOnWindowFocus: false,
    cacheTime: 0,
  });

  const {
    data: currentLoggedInUser,
    isLoading,
    isError,
  } = useQuery(
    ['checkAuthAuthor'],
    () => getCheckAuthAuthor(getUserId()),
    {
      retry: false,
    }
  );

  return (
    <div className="w-[720px] h-full">
      <Comments
        postId={postId!}
        currentUserId={
          currentLoggedInUser?._id ? currentLoggedInUser._id : null
        }
        pinnedComment={
          data?.pinnedComment ? data.pinnedComment._id : null
        }
      />
    </div>
  );
};
