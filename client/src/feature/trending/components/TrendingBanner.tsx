import { FC } from 'react';

export const TrendingBanner: FC = (): JSX.Element => {
  return (
    <div className="flex justify-center gap-2 text-white">
      <h1 className="text-3xl">Trending</h1>
      <img
        src="../../../assets/img/trending.svg"
        alt="trending"
        className="w-9"
      />
    </div>
  );
};
