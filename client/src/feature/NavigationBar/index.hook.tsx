import { useGoogleLogin } from '@react-oauth/google';
import { useState } from 'react';
import { postGoogleOAuth, postLogOut } from '../../api/oAuthAPI';

const useLogin: Function = (): { isLoggedIn: boolean; googleLogin: () => void; userLogout: () => Promise<void> } => {
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

  // TODO: logout
  const userLogout: () => Promise<void> = async (): Promise<void> => {
    await postLogOut();
    localStorage.removeItem('jwt');
    localStorage.removeItem('userInfo');
    setLogIn((prev) => !prev);
  };

  return { isLoggedIn, googleLogin, userLogout };
};
