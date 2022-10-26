import { FC, useState } from 'react';
import { CloseButtonSVG } from '../../components';
import { LoginButton } from './components/LoginButton';

interface LoginProps {
  googleLogin: () => void;
  setPresentLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Login: FC<LoginProps> = ({ googleLogin, setPresentLogin }): JSX.Element => {
  const onClosePopup: React.MouseEventHandler<HTMLButtonElement> = ():void => {
    setPresentLogin(false);
  };

  const onLogin: React.MouseEventHandler<HTMLButtonElement> = ():void => {
    googleLogin();
  }

  return (
    <>
      <div className="fixed flex justify-center items-center top-0 left-0 h-screen w-screen blur bg-opacity-80  bg-primary-black "></div>
      <div className="fixed flex justify-center items-center top-0 left-0 h-screen w-screen">
        <div className="relative flex flex-col justify-center items-center gap-4 w-[300px] rounded-xl p-2 border-2 bg-secondary-black">
          <h1 className="w-fit text-5xl font-gemini mb-3 text-white">Login</h1>
          <button onClick={onClosePopup} type="button" className="absolute top-2 right-2 w-5 h-5 rounded-full">
            <CloseButtonSVG />
          </button>
          <button type="button" onClick={onLogin}>
            <LoginButton />
          </button>
          <p className="text-xs text-center italic text-white">
            By continuing, you are agreeing to set up a BrainLeak account and agreeing to our User Agreement and Privacy Policy.
          </p>
          <img src="/assets/img/loginPictureLeft.png" alt="cat-left" className="absolute hidden right-[268px] top-[10px] w-32 xs:block" />
          <img
            src="/assets/img/loginPictureRight.png"
            alt="cat-right"
            className="absolute hidden left-[268px] bottom-[10px] w-32 xs:block"
          />
        </div>
      </div>
    </>
  );
};
