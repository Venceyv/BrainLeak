import { useGoogleLogin } from '@react-oauth/google';
import { postGoogleOAuth, postLogOut } from '../../api/oAuthAPI';
import { useEffect, useRef, useState } from 'react';

// TODO: USER LOGOUT return type
const useLogin: Function = (): { isLoggedIn: boolean; userLogin: () => Function; userLogout: () => Function } => {
  const [isLoggedIn, setLogIn] = useState<boolean>(false);

  const googleLogin = useGoogleLogin({
    onSuccess: async ({ code }) => {
      try {
        const data = await postGoogleOAuth(code);
        localStorage.setItem('jwt', JSON.stringify(data.token));
        localStorage.setItem('userInfo', JSON.stringify(data.dbBack));

        setLogIn((prev) => !prev);
        //TODO display: login error
      } catch (error) {
        throw error;
      }
    },
    onError: async (err) => {
      throw err;
    },
    flow: 'auth-code',
  });

  const userLogin: () => Function = () => {
    return () => {
      googleLogin();
    };
  };

  // TODO: logout
  const userLogout: () => Function = () => {
    return async () => {
      await postLogOut();
      localStorage.removeItem('jwt');
      localStorage.removeItem('userInfo');
      setLogIn((prev) => !prev);
    };
  };

  return { isLoggedIn, userLogin, userLogout };
};

const useDetectOutsideClick: Function = (userRef: React.MutableRefObject<HTMLDivElement>, setUserDropDown: (a: boolean) => void) => {
  const detectOutsideClick = (event: globalThis.MouseEvent) => {
    // detect clicks outside dropdown
    const target: HTMLImageElement = event.target as HTMLImageElement;
    if (userRef.current && !userRef.current.contains(event.target as Node) && !(target.id === 'user-img')) {
      setUserDropDown(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', (e: globalThis.MouseEvent) => {
      detectOutsideClick(e);
    });
  }, []);
};

const useDropDown: Function = (): {
  userRef: React.MutableRefObject<HTMLDivElement>;
  dropdown: boolean;
  toggleUserDropDown: () => void;
  setUserDropDown: (dropdownState: boolean) => void;
} => {
  const userRef = useRef<HTMLDivElement>(null) as React.MutableRefObject<HTMLDivElement>;
  const [dropdown, setDropdown] = useState<boolean>(false);

  const toggleUserDropDown = () => {
    setDropdown((prev) => !prev);
  };

  const setUserDropDown = (dropdownState: boolean) => {
    setDropdown(dropdownState);
  };

  return { userRef, dropdown, toggleUserDropDown, setUserDropDown };
};

export { useLogin, useDropDown, useDetectOutsideClick };
