import { useGoogleLogin } from "../../lib";
import googleOAuth from "../../services/oAuthAPI";
import { useEffect, useRef, useState } from "react";

// TODO: USER LOGOUT return type
const useLogin:Function = (): {isLoggedIn: boolean, userLogin: () => Function} => {
  const [isLoggedIn, setLogIn] = useState<boolean>(false);

  const googleLogin = useGoogleLogin({
    onSuccess: async ({ code }) => {
      const tokens = await googleOAuth(code);
      setLogIn(prev => !prev);
      console.log(tokens);
      return tokens;
    },
    onError: async (err) => {
      return null;
    },
    flow: "auth-code",
  });

  const userLogin = () => {
    return () => {
      const user = googleLogin();
      return user;
    };
  };

  // TODO: logout
  const userLogout = () => {};

  return { isLoggedIn, userLogin };
};

const useDetectOutsideClick:Function = (userRef:React.MutableRefObject<HTMLDivElement>, setUserDropDown:(a:boolean)=>void) => {
  const detectOutsideClick = (event:globalThis.MouseEvent) => {

    // detect clicks outside dropdown
    const target:HTMLImageElement = event.target as HTMLImageElement;
    if (userRef.current && !userRef.current.contains(event.target as Node) && !(target.id === 'user-img')) {
      setUserDropDown(false);
    }
  }
  
  useEffect(() => {
    document.addEventListener('mousedown', (e:globalThis.MouseEvent)=> {
      detectOutsideClick(e);
    })
  }, [])
}

const useDropDown:Function = (): {userRef: React.MutableRefObject<HTMLDivElement>, dropdown: boolean, toggleUserDropDown:()=>void, setUserDropDown:(dropdownState: boolean) => void} => {
  const userRef = useRef<HTMLDivElement>(null) as React.MutableRefObject<HTMLDivElement>;
  const [dropdown, setDropdown] = useState<boolean>(false);

  const toggleUserDropDown = () => {
    setDropdown(prev => !prev);
  }
  
  const setUserDropDown = (dropdownState:boolean) => {
    setDropdown(dropdownState);
  }

  return { userRef, dropdown, toggleUserDropDown, setUserDropDown};
};

export { useLogin, useDropDown, useDetectOutsideClick };
