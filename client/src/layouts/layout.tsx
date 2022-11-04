import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { NavBar } from '../feature/NavBar';

export const Layout: FC = (): JSX.Element => {
  return (
    <div className="w-full h-full bg-primary-black">
      <NavBar />
      <Outlet />
    </div>
  );
};
