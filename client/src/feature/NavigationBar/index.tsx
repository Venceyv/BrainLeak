import { FC, useEffect } from 'react';
import { NavbarItem } from './components/NavbarItem';
import { useLogin } from './index.hook';
import { Login } from '../Login/index';
import { getCheckAuth } from '../../api/userAPI';
import { useQuery } from '@tanstack/react-query';
import { getJWT, getUserId } from '../../utils/getLocalStorage';

export const NavigationBar: FC = (): JSX.Element => {
  const { isLoggedIn, setLogIn, googleLogin, userLogout, isPresentLogin, setPresentLogin } = useLogin();

  useEffect(()=>{
    const checkUserAuth: Function = async (userId:string) => {
      const user = await getCheckAuth(userId)

      if(user) {
        console.log('persistent')
      }else{
        console.log('not logged in')
      }
    }

    const userId:string = getUserId();
    if(userId !== null) {
      checkUserAuth();
    }
  }, [])

  return (
    <div>
      <NavbarItem isLoggedIn={isLoggedIn} userLogout={userLogout} setPresentLogin={setPresentLogin} />
      {isPresentLogin && <Login googleLogin={googleLogin} setPresentLogin={setPresentLogin} />}
    </div>
  );
};
