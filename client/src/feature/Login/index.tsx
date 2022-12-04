import { useGoogleLogin } from '@react-oauth/google';
import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postGoogleOAuth, postLogOut } from '../../api/oAuthAPI';
import { CloseButtonSVG } from '../../components';
import { LoginButton } from './components/LoginButton';
import { useLogin } from './index.hook';

interface LoginProps {
  setLogin: React.Dispatch<React.SetStateAction<boolean>>;
  setPresentLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Login: FC<LoginProps> = ({
  setLogin,
  setPresentLogin,
}): JSX.Element => {
  const navigate = useNavigate();
  const { googleLogin, closeLogin } = useLogin({
    setLogin,
    setPresentLogin,
    navigate,
  });

  return (
    <>
      <div className="z-20 relative flex flex-col justify-center items-center gap-4 w-[300px] rounded-xl p-2 border-2 bg-secondary-black">
        <h1 className="w-fit text-5xl font-gemini mb-3 text-white">
          Login
        </h1>
        <button
          type="button"
          className="absolute top-2 right-2 w-5 h-5 rounded-full"
          onClick={closeLogin}
        >
          <CloseButtonSVG />
        </button>
        <button type="button" onClick={googleLogin}>
          <LoginButton />
        </button>
        <p className="text-xs text-center italic text-white">
          By continuing, you are agreeing to set up a BrainLeak
          account and agreeing to our User Agreement and Privacy
          Policy.
        </p>
        <img
          src="/assets/img/loginPictureLeft.png"
          alt="cat-left"
          className="absolute hidden right-[268px] top-[10px] w-32 xs:block"
        />
        <img
          src="/assets/img/loginPictureRight.png"
          alt="cat-right"
          className="absolute hidden left-[268px] bottom-[10px] w-32 xs:block"
        />
      </div>
    </>
  );
};
