import { useGoogleLogin } from "../../lib";
import googleOAuth from "../../services/oAuthAPI";
import useLocalStorage from "../../hooks/useLocalStorage";
import { useState } from "react";

// Login
const useLogin = () => {
  const [isLoggedIn, setLogIn] = useState<boolean>(false);
  // const [ user, getAuth, setAuth, removeAuth ] = useLocalStorage('user', '');

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

export { useLogin };
