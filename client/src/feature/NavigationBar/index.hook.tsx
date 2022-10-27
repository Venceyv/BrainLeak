import { useGoogleLogin } from '@react-oauth/google';
import { useState } from 'react';
import { postGoogleOAuth, postLogOut } from '../../api/oAuthAPI';

interface useLoginReturnProp {
  isLoggedIn: boolean;
  googleLogin: Function;
  userLogout: () => Promise<void>;
  isPresentLogin: boolean;
  setPresentLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useLogin: Function = (): useLoginReturnProp => {
  const [isLoggedIn, setLogIn] = useState<boolean>(false);
  const [isPresentLogin, setPresentLogin] = useState<boolean>(false);

  const googleLogin = useGoogleLogin({
    onSuccess: async ({ code }) => {
      try {
        const data = await postGoogleOAuth(code);
        localStorage.setItem('jwt', JSON.stringify(data.accessToken));
        localStorage.setItem('userId', JSON.stringify(data.dbBack._id));
        setLogIn(true);
        setPresentLogin(false);
      } catch (error) {
        throw error;
      }
    },
    onError: async (err) => {
      throw err;
    },
    flow: 'auth-code',
  });

  const userLogout: () => Promise<void> = async (): Promise<void> => {
    try {
      await postLogOut();

      localStorage.removeItem('jwt');
      localStorage.removeItem('userInfo');
      setLogIn(false);
    } catch (error) {
      throw error;
    }
  };

  return { isLoggedIn, googleLogin, userLogout, isPresentLogin, setPresentLogin };
};
