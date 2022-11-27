import { useGoogleLogin } from '@react-oauth/google';
import { postGoogleOAuth } from '../../api/oAuthAPI';
import { errorToast } from '../../utils/errorToast';

interface useLoginParam {
  setPresentLogin: React.Dispatch<React.SetStateAction<boolean>>;
  setLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

interface useLoginReturn {
  googleLogin: () => void;
  closeLogin: React.MouseEventHandler<HTMLButtonElement>;
}

export const useLogin = ({ setPresentLogin, setLogin }: useLoginParam): useLoginReturn => {
  const googleLogin = useGoogleLogin({
    onSuccess: async ({ code }) => {
      try {
        const data = await postGoogleOAuth(code);

        localStorage.setItem('jwt', JSON.stringify(data.accessToken));
        localStorage.setItem('userId', JSON.stringify(data.dbBack._id));

        setLogin(true);
        setPresentLogin(false);
      } catch (error) {
        errorToast(`Oops! Something went wrong.`);
        throw error;
      }
    },
    onError: async (error) => {
      errorToast(`Oops! Something went wrong.`);
      throw error;
    },
    flow: 'auth-code',
  });

  const closeLogin: React.MouseEventHandler<HTMLButtonElement> = (): void => {
    setPresentLogin(false);
    console.log('closed');
  };

  return { googleLogin, closeLogin };
};
