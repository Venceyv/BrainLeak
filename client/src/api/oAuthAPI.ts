import { axios } from '../lib';
import { URL } from '../data/Constants';
import { getRequestHeader } from '../utils/getHttpRequestHeader';

//remove axios

//TODO Promise type
// Google OAuth
export const googleOAuth: Function = async (code: string): Promise<any> => {
  const data = await fetch(`${URL}/auth/google`, {
    method:'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({code: code}),
  });

  const resData = (data.ok) ? await data.json() : null;

  return resData;
};

//log out
export const logOut: Function = async (): Promise<any> => {
  const user = localStorage.getItem('userInfo');
  console.log(user);
  const userid = JSON.parse(user as string);
  // return 
  const data = await fetch(`${URL}/users/logout/${userid._id}`, { 
    method: 'post', 
    headers: getRequestHeader()
});
};
