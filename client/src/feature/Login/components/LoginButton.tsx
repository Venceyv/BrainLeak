import { FC } from 'react';
import { GoogleSVG } from '../../../components/GoogleSVG';

export const LoginButton: FC = (): JSX.Element => {
  return (
    <div className="group flex flex-row justify-center items-center gap-2 border-2 p-1 rounded-xl w-[260px] transition ease-in-out hover:border-primary-black hover:bg-white border-white">
      <GoogleSVG />
      <h1 className="text-lg transition ease-in-out group-hover:text-secondary-black text-white">
        Continue With Google
      </h1>
    </div>
  );
};
