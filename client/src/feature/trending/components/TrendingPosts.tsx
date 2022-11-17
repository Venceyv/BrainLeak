import { useQuery } from '@tanstack/react-query';
import { FC } from 'react';
import { getTrendingPosts } from '../../../api/postAPI';
import { TrendingPost } from './TrendingPost';

export const TrendingPosts: FC = () => {
  const { data, isLoading, isSuccess } = useQuery(['trendingPosts'], () => getTrendingPosts());

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex gap-5 justify-center flex-wrap h-40 overflow-hidden">
      {isSuccess &&
        data.map((post, index) => {
          return <TrendingPost key={index} popularity={post.popularity} post={post.post} />;
        })}
    </div>
  );
};
