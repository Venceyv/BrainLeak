import { useQuery } from '@tanstack/react-query';
import { FC } from 'react';
import { getTrendingPosts } from '../../../api/postAPI';
import { Loading } from '../../../components/Loading';
import { TrendingPost } from './TrendingPost';

const displayHorizontal =
  'flex flex-row gap-2 justify-center flex-wrap h-40 overflow-hidden';
const displayVertical =
  'flex flex-col gap-3 justify-center items-center h-fit';

export const TrendingPosts: FC<{ isHome: boolean }> = ({
  isHome,
}) => {
  const { data, isLoading, isSuccess } = useQuery(
    ['trendingPosts'],
    () => getTrendingPosts()
  );

  if (isLoading) {
    return <Loading width={'full'} height={'[160px]'} />;
  }

  return (
    <>
      <div className={isHome ? displayHorizontal : displayVertical}>
        {isSuccess &&
          data.map((post, index) => {
            return (
              <TrendingPost
                key={index}
                popularity={post.popularity}
                post={post.post}
              />
            );
          })}
      </div>
    </>
  );
};
