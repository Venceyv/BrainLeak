import { FC } from 'react';
import { TrendingBanner } from './components/TrendingBanner';
import { TrendingPosts } from './components/TrendingPosts';

export const Trending: FC = (): JSX.Element => {
  return (
    <div className="flex flex-col gap-3 pb-3 pt-9 mb-4 px-0">
      <TrendingBanner />
      <TrendingPosts />
    </div>
  );
};
