import { useGoogleLogin } from '@react-oauth/google';
import { FC, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { postGoogleOAuth, postLogOut } from '../api/oAuthAPI';
import { Login } from '../feature/Login';
import { Navbar } from '../feature/Navbar';

const useLogin: Function = (): { isLoggedIn: boolean; userLogin: () => void; userLogout: () => Promise<void> } => {
  const [isLoggedIn, setLogIn] = useState<boolean>(false);

  const googleLogin = useGoogleLogin({
    onSuccess: async ({ code }) => {
      try {
        const data = await postGoogleOAuth(code);
        localStorage.setItem('jwt', JSON.stringify(data.token));
        localStorage.setItem('userInfo', JSON.stringify(data.dbBack));

        setLogIn((prev) => !prev);
        //TODO display: login error
      } catch (error) {
        throw error;
      }
    },
    onError: async (err) => {
      throw err;
    },
    flow: 'auth-code',
  });

  const userLogin: () => void = (): void => {
    googleLogin();
  };

  // TODO: logout
  const userLogout: () => Promise<void> = async (): Promise<void> => {
    await postLogOut();
    localStorage.removeItem('jwt');
    localStorage.removeItem('userInfo');
    setLogIn((prev) => !prev);
  };

  return { isLoggedIn, userLogin, userLogout };
};

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
