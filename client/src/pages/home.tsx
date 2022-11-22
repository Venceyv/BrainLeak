import { FC } from 'react';
import { Posts } from '../components/index';
import { AbstractPost } from '../feature/AbstractPost';
import { TopUser } from '../feature/TopUser';
import { Trending } from '../feature/trending';

export const Home: FC = (): JSX.Element => {
  return (
    <div className="flex justify-center bg-primary-black">
      <div className="flex flex-col w-full max-w-[1024px] h-[calc(100%-56px)] content-start bg-primary-black text-white">
        <Trending />
        <div className="flex flex-row max-w-[1024px]">
          <AbstractPost />
          <TopUser />
        </div>
      </div>
    </div>
  );
};
