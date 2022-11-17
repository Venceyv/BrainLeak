import { FC } from 'react';
import { TrendingBanner } from './components/TrendingBanner';
import { TrendingPosts } from './components/TrendingPosts';

export const Trending: FC = (): JSX.Element => {
  return (
    <div className="flex flex-col gap-3 p-3">
      <TrendingBanner />
      <TrendingPosts />
    </div>
  );
};
