import { FC, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LoginSVG } from '../../../components';
import { Login } from '../../Login';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

interface LoginItemProp {
  setLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

export const LoginItem: FC<LoginItemProp> = ({ setLogin }): JSX.Element => {
  const [isPresentLogin, setPresentLogin] = useState<boolean>(false);

  const togglePresentLogin: React.MouseEventHandler<
    HTMLButtonElement
  > = (): void => {
    setPresentLogin(true);
  };

  return (
    <>
      <Popup
        open={isPresentLogin}
        trigger={
          <button
            className="flex px-2 py-1 pt-[5px] text-sm font-medium rounded-md border-[1px] cursor-pointer transition text-black bg-white hover:bg-primary-black hover:text-white hover:border-white"
            onClick={togglePresentLogin}
          >
            Login
            <div className="ml-0.5">
              <LoginSVG />
            </div>
          </button>
        }
        closeOnDocumentClick
        modal
        onOpen={() => setPresentLogin(true)}
        onClose={() => setPresentLogin(false)}
      >
        <div className="fixed top-0 left-0 flex items-center h-screen w-[calc(100vw-18px)] blur bg-opacity-80 bg-primary-black "></div>
        <Login setLogin={setLogin} setPresentLogin={setPresentLogin} />
      </Popup>
    </>
  );
};
