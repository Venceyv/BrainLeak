import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { NavigationBar } from '../feature/NavigationBar';

export const Layout: FC = (): JSX.Element => {
  return (
    <div className="w-full h-full bg-primary-black">
      <NavigationBar />
      <Outlet />
    </div>
  );
};
