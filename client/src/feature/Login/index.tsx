import { FC, useState } from 'react';
import { LoginButton } from './components/LoginButton';

interface LoginProps {
  setPresentLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Login: FC<LoginProps> = ({ setPresentLogin }): JSX.Element => {
  return (
    <>
      <div className="fixed flex justify-center items-center top-0 left-0 h-screen w-screen blur bg-opacity-80  bg-primary-black "></div>
      <div className="fixed flex justify-center items-center top-0 left-0 h-screen w-screen">
        <div className="relative flex flex-col justify-center items-center gap-4 w-[300px] rounded-xl p-2 border-2 bg-secondary-black">
          <h1 className="w-fit text-5xl font-gemini mb-3 text-white">Login</h1>
          <div>
            <LoginButton />
          </div>
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
