import { FC, useEffect } from "react";
import { NavbarItem } from "./components/NavbarItem";
import { useLogin } from "./index.hook";
import { Login } from "../Login/index";
import { getCheckAuth } from "../../api/userAPI";
import { useQuery } from "@tanstack/react-query";

export const NavigationBar: FC = (): JSX.Element => {
  const { isLoggedIn, googleLogin, userLogout, isPresentLogin, setPresentLogin } = useLogin();
  // const {isLoading, }

  useEffect(() => {

    
  //   const userId:string = JSON.parse(localStorage.getItem('userId') as string);
  //   console.log(userId);
  //   const jwt = localStorage.getItem('jwt');
  //   console.log(jwt)
  // const token: string = ( jwt != "undefined") ? JSON.parse(jwt as string) as string : '';
  // console.log(token)
    console.log('rendered')
    const checkAuth = async () => {
      const data = await getCheckAuth("634f3fdb38ca1630099d7f27"); 

      console.log(data);
    }

    checkAuth();

  //   if(userId != 'undefined'){
  //     checkAuth();
  //   }

  //   console.log('none');
  }, [])

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
