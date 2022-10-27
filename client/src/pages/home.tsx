import { FC } from 'react';
import { Posts } from '../components/index';

export const Home: FC = (): JSX.Element => {
  return (
    <div className="grid items-center w-full h-[calc(100%-56px)] bg-primary-black text-white">
      <Posts />
    </div>
  );
};
