import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components';

export const Layout: FC = (): JSX.Element => {
  return (
    <div className="w-full h-full bg-primary-black">
      <Navbar />
      <Outlet />
    </div>
  );
};
