import { FC, useState } from "react";
import { NavbarItem } from "./components/NavbarItem";
import { useLogin } from "./index.hook";
import { Login } from "../Login/index";

export const NavigationBar: FC = (): JSX.Element => {
  const { isLoggedIn, googleLogin, userLogout, isPresentLogin, setPresentLogin } = useLogin();

  return (
    <div>
      <NavbarItem
        isLoggedIn={isLoggedIn}
        userLogout={userLogout}
        setPresentLogin={setPresentLogin}
      />
      {isPresentLogin && (
        <Login googleLogin={googleLogin} setPresentLogin={setPresentLogin} />
      )}
    </div>
  );
};
