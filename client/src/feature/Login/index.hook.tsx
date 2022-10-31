import { useGoogleLogin } from '@react-oauth/google';
import { useState } from 'react';
import { postGoogleOAuth, postLogOut } from '../../api/oAuthAPI';

interface useLoginParam {
  setPresentLogin: React.Dispatch<React.SetStateAction<boolean>>;
  setLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

interface useLoginReturn {
  googleLogin: () => void;
  closeLogin: React.MouseEventHandler<HTMLButtonElement>;
}

interface User {
  avatar: string;
  backgroundCover: string;
  introduction: string;
  username: string;
  _id: string;
}

export const useLogin = ({ setPresentLogin, setLogin }: useLoginParam): useLoginReturn => {
  const googleLogin = useGoogleLogin({
    onSuccess: async ({ code }) => {
      try {
        const data = await postGoogleOAuth(code);

        console.log(data);
        localStorage.setItem('jwt', JSON.stringify(data.accessToken));
        localStorage.setItem('userId', JSON.stringify(data.dbBack._id));

        setLogin(true);
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

  const closeLogin: React.MouseEventHandler<HTMLButtonElement> = (): void => {
    setPresentLogin(false);
  };

  return { googleLogin, closeLogin };
};
