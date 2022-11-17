import { FC } from 'react';
import { Posts } from '../components/index';
import { Trending } from '../feature/trending';

export const Home: FC = (): JSX.Element => {
  return (
    <div className="grid items-center w-full h-[calc(100%-56px)] content-start bg-primary-black text-white">
      <Trending />
      <Posts />
    </div>
  );
};
