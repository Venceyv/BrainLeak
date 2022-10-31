import { FC, useState } from 'react';
import { postLogOut } from '../../../api/oAuthAPI';
import { LoginSVG } from '../../../components';
import { Login } from '../../Login';

interface LoginItemProp {
  setLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

export const LoginItem: FC<LoginItemProp> = ({ setLogin }): JSX.Element => {
  const [isPresentLogin, setPresentLogin] = useState<boolean>(false);

  const togglePresentLogin: React.MouseEventHandler<HTMLButtonElement> = (): void => {
    setPresentLogin((prev) => !prev);
  };

  return (
    <>
      <button
        className="flex px-2 py-1 pt-[5px] text-sm font-medium rounded-md border-[1px] cursor-pointer transition text-black bg-white hover:bg-primary-black hover:text-white hover:border-white"
        onClick={togglePresentLogin}
      >
        Login
        <div className="ml-0.5">
          <LoginSVG />
        </div>
      </button>

      {isPresentLogin && <Login setLogin={setLogin} setPresentLogin={setPresentLogin} />}
    </>
  );
};
