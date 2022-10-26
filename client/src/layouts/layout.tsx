import { FC, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Login } from '../feature/Login';
import { Navbar } from '../feature/Navbar';

const NavigationBar: FC = (): JSX.Element => {
  const [isPresentLogin, setPresentLogin] = useState<boolean>(false);
  return (
    <>
      <Navbar setPresentLogin={setPresentLogin} />
      {isPresentLogin && <Login setPresentLogin={setPresentLogin} />}
    </>
  );
};

export const Layout: FC = (): JSX.Element => {
  return (
    <div className="w-full h-full bg-primary-black">
      <NavigationBar />
      <Outlet />
    </div>
  );
};
