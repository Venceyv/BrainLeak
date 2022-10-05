import { useGoogleLogin } from "../../lib";
import googleOAuth from "../../services/oAuthAPI";
import { useState } from "react";

// Login
const useLogin = () => {
  const [isLoggedIn, setLogIn] = useState<boolean>(true);

  const googleLogin = useGoogleLogin({
    onSuccess: async ({ code }) => {
      const tokens = await googleOAuth(code);
      console.log(tokens);
      setLogIn(!isLoggedIn);
    },
    onError: async (err) => {
      console.log(err);
    },
    flow: "auth-code",
  });

  const userLogin = () => {
    return () => {
      googleLogin();
    };
  };

  // TODO
  const userLogout = () => {};

  return { isLoggedIn, userLogin };
};

export { useLogin };
