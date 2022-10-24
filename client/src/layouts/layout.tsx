import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { Login } from '../feature/Login';
import { Navbar } from '../feature/Navbar';

interface PresentLoginProp {
  isPresentLogin:boolean;
  setPresentLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Layout: FC = (): JSX.Element => {
  return (
    <div className="w-full h-full bg-primary-black">
      <Navbar setPresentLogin={setPresentLogin}/>
      {isPresentLogin && <Login setPresentLogin={setPresentLogin}/>}
      <Outlet />
    </div>
  );
};
