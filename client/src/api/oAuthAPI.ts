import { axios } from '../lib';
import { URL } from '../data/Constants';

// Google OAuth
export const googleOAuth: Function = async (code: string): Promise<any> => {
  return await axios.post(`${URL}/auth/google`, {
    code,
  });
};

export const getData = async () => {
  return await axios.get(`${URL}/users/posts/634ab643d23a54464901e476?pagenumber=1&pagesize=10&q=latest`);
};

//log out
export const logOut: Function = async (): Promise<any> => {
  const authorization: string | null = localStorage.getItem('jwt');
  const user = localStorage.getItem('userInfo');
  console.log(user);
  const userid = JSON.parse(user as string);
  console.log(userid);
  const auth = {
    'Authorization': `Bearer ${authorization}`,
    withCredentials: true,
  };
  return await axios.post(
    `${URL}/users/logout/${userid._id}`,
    {},
    {
      headers: auth,
    }
  );
};
