import { FC } from 'react';
import { TrendingBanner } from './components/TrendingBanner';
import { TrendingPosts } from './components/TrendingPosts';

const displayHorizontal = 'flex flex-col gap-3 pb-3 pt-9 mb-4 px-0';
const displayVertical =
  'flex flex-col gap-3 pb-3 pt-9 mb-4 px-0 w-[270px] h-full';

export const Trending: FC<{ isHome: boolean }> = ({
  isHome,
}): JSX.Element => {
  return (
    <div className={isHome ? displayHorizontal : displayVertical}>
      <TrendingBanner />
      <TrendingPosts isHome={isHome} />
    </div>
  );
};
