import { useEffect } from 'react';
import { getCheckAuth } from './api/userAPI';

export const Test = () => {
  const checkAuth = async () => {
    const data = await getCheckAuth('634f3fdb38ca1630099d7f27');

    console.log(data);
  };
  // useEffect(() => {
  //   //   const userId:string = JSON.parse(localStorage.getItem('userId') as string);
  //   //   console.log(userId);
  //   //   const jwt = localStorage.getItem('jwt');
  //   //   console.log(jwt)
  //   // const token: string = ( jwt != "undefined") ? JSON.parse(jwt as string) as string : '';
  //   // console.log(token)
  //   console.log('rendered');

  //   checkAuth();

  //   //   if(userId != 'undefined'){
  //   //     checkAuth();
  //   //   }

  //   //   console.log('none');
  // }, []);
  return (
    <button type="button" onClick={checkAuth}>
      hello
    </button>
  );
};
