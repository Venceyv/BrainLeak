import { useGoogleLogin } from '@react-oauth/google';
import { useState } from 'react';
import { postGoogleOAuth, postLogOut } from '../../api/oAuthAPI';

interface useLoginReturn {
  isLoggedIn: boolean;
  setLogIn: React.Dispatch<React.SetStateAction<boolean>>;
  googleLogin: () => void;
  userLogout: () => Promise<void>;
  isPresentLogin: boolean;
  setPresentLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

interface User {
  avatar: string;
  backgroundCover: string;
  introduction: string;
  username: string;
  _id: string;
}

export const useLogin = (): useLoginReturn => {
  const [isLoggedIn, setLogIn] = useState<boolean>(false);
  const [isPresentLogin, setPresentLogin] = useState<boolean>(false);

  const googleLogin = useGoogleLogin({
    onSuccess: async ({ code }) => {
      try {
        const data = await postGoogleOAuth(code);

        console.log(data);
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

  const userLogout = async (): Promise<void> => {
    try {
      await postLogOut();

      localStorage.removeItem('jwt');
      localStorage.removeItem('userInfo');
      setLogIn(false);
    } catch (error) {
      throw error;
    }
  };

  return { isLoggedIn, setLogIn, googleLogin, userLogout, isPresentLogin, setPresentLogin };
};