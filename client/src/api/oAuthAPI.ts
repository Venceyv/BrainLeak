import { axios } from '../lib';
import { URL } from '../data/Constants';

// Google OAuth
export const googleOAuth: Function = async (code: string): Promise<any> => {
  return await axios.post(`${URL}/auth/google`, {
    code,
  });
};

//log out
export const logOut: Function = async (): Promise<any> => {
  const authorization = JSON.parse(localStorage.getItem('jwt') as string);
  const user = localStorage.getItem('userInfo');
  console.log(user);
  const userid = JSON.parse(user as string);
  // return 
  const data = await fetch(`${URL}/users/logout/${userid._id}`, { 
    method: 'post', 
    headers: new Headers({
        'Authorization': `Bearer ${authorization}`, 
        'Content-Type': 'application/json'
    })
});
};
