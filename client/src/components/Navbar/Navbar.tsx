import { useGoogleLogin } from '../../lib';
import { googleOAuth } from '../../services/postApi';
import { FC, useState } from 'react';

const loginSVG = () => {
  return (
    <svg viewBox="0 0 1024 1024" width="20" height="20">
      <path
        className="hover:fill-white"
        d="M271 957c-4.2 0-8.6-0.4-12.4-0.8l-89.8-12.4c-43-5.8-82-44.4-88.6-88.2l-12.4-90.8c-4.2-29 8.2-66.6 29-87.8l181.8-181.8c-29.4-117.6 4.6-242 91.2-327.6 134.2-133.8 352.4-134.2 487.2 0 65 65 100.6 151.6 100.6 243.6s-35.6 178.6-100.6 243.6c-87 86.2-210.8 120.2-327.6 90.2l-182.2 181.8c-17.8 18.2-49 30.2-76.2 30.2z m341.6-828c-72.4 0-144.6 27.4-199.6 82.4-74.6 74.2-101.4 182.6-70.4 283.8 3.4 11.2 0.4 22.8-7.8 31L140 720.8c-7 7-12.8 25.2-11.6 34.8l12.4 90.8c2.4 15.8 19.4 33.6 35.2 35.6l90.2 12.4c10 1.6 28.2-4.2 35.2-11.2l195.6-195c8.2-8.2 20.2-10.8 31-7.4 99.8 31.4 208.8 4.6 283.4-70 53-53 82.4-124.2 82.4-199.6 0-75.8-29.4-146.6-82.4-199.6-53.8-54.8-126.2-82.6-198.8-82.6z"
        p-id="3773"
        fill="currentColor"
      ></path>
      <path
        className="hover:fill-white"
        d="M395.6 865.4c-7.8 0-15.8-2.8-22-9.2l-95.2-95.2c-12-12-12-31.8 0-44 12-12 31.8-12 44 0l95.2 95.2c12 12 12 31.8 0 44-6.2 6.4-14.2 9.2-22 9.2zM615.6 501.4c-51.4 0-93.2-41.8-93.2-93.2s41.8-93.2 93.2-93.2 93.2 41.8 93.2 93.2-41.8 93.2-93.2 93.2z m0-124.4c-17 0-31 14-31 31s14 31 31 31 31-14 31-31-14-31-31-31z"
        p-id="3774"
        fill="currentColor"
      ></path>
    </svg>
  );
};

const notificationSVG = () => {
  return (
    <svg viewBox="0 0 1024 1024" width="29" height="29">
      <path
        className="fill-white"
        d="M511.8 448.4c-16.8 0-30.8-14-30.8-30.8v-136.8c0-16.8 14-30.8 30.8-30.8s30.8 14 30.8 30.8v136.8c0.2 17.2-13.8 30.8-30.8 30.8z"
        p-id="1592"
        fill="currentColor"
      ></path>
      <path
        className="fill-white"
        d="M512.8 852.2c-106 0-211.6-16.8-312.2-50.6-37.4-12.4-65.8-39-78-72.8-12.4-33.6-8.2-72.4 12-106l52.2-87.2c11.6-19.4 21.8-55.4 21.8-78v-86.2c0-168 136.4-304.4 304.4-304.4 168 0 304.4 136.4 304.4 304.4v86.2c0 22.2 10.2 58.8 21.8 78l52.2 87.2c19.4 32 22.6 70.2 9.8 105.2s-40.6 61.6-76 73.6c-100.8 34.2-206.4 50.6-312.4 50.6z m0-723.2c-134 0-242.8 108.8-242.8 242.8V458c0 33.2-13.2 81.4-30.4 109.8l-52.2 87.6c-10.6 17.6-13.2 36.6-7 53 6.2 16.4 20.2 28.8 39.8 35.4 189 62.8 397 62.8 586 0 17.6-5.8 31.2-19 37.4-36.2 6.6-17.2 4.6-36.2-5-52.2l-52.2-87.2c-17.2-28.4-30.4-76.4-30.4-109.8v-86.2c-0.4-134.2-109.4-243.2-243.2-243.2z"
        p-id="1593"
        fill="currentColor"
      ></path>
      <path
        className="fill-white"
        d="M511.8 957c-44 0-87.2-18-118.4-49.4-31.2-31.2-49.4-74.4-49.4-118.4h61.6c0 28 11.6 55 31.2 74.8 19.8 19.8 46.8 31.2 74.8 31.2 58.4 0 106-47.6 106-106h61.6c0.4 92.6-74.8 167.8-167.4 167.8z"
        p-id="1594"
        fill="currentColor"
      ></path>
    </svg>
  );
};

//TODO: add user name @61
const userIcon = () => {
  return (
    <div className="relative flex flex-col">
      <img
        className="peer max-w-[36px] max-h-[36px] min-w-[36px] min-h-[36px] rounded-full border-[1px] cursor-pointer border-white"
        src="/src/assets/img/testUserPic.jpeg"
        alt="user"
      />

      <div className="flex flex-col items-center gap-y-3 absolute w-60 top-[46px] right-2 border-[1px] peer-hover:block bg-secondary-black border-zinc-700">
        <div className="flex items-center p-2 border-b-[1px] border-zinc-700 w-full">
          <img
            className="peer max-w-[36px] max-h-[36px] min-w-[36px] min-h-[36px] rounded-full border-[1px] cursor-pointer border-white"
            src="/src/assets/img/testUserPic.jpeg"
            alt="user"
          />
          <div className="align overflow-hidden text-ellipsis h-fit ml-2.5 text-zinc-50 ">
            VenceyvVenceyvVenceyvVenceyv
          </div>
        </div>

        <ul>
          <li className="text-zinc-50">Profile</li>
          <li className="text-zinc-50">Sign out</li>
        </ul>
      </div>
    </div>
  );
};

const useLogin = () => {
  const [isLoggedIn, setLogIn] = useState<boolean>(false);

  const googleLogin = useGoogleLogin({
    onSuccess: async ({ code }) => {
      const tokens = await googleOAuth(code);
      console.log(tokens);
      setLogIn(!isLoggedIn);
    },
    onError: async (err) => {
      console.log(err);
    },
    flow: 'auth-code',
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

export const Navbar: FC = () => {
  const { isLoggedIn, userLogin } = useLogin();

  return (
    <div className="sticky flex items-center justify-start top-0 flex-1 h-[56px] w-full gap-8 px-4 mx-auto drop-shadow-md bg-secondary-black">
      <div className="flex items-center text-white ">
        <span className="sr-only">Home</span>
        <div className="h-full font-gemini text-3xl m-2">BrainLeak</div>
      </div>

      <div className="relative mx-auto">
        <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
          <svg
            aria-hidden="true"
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>

        <input
          type="search"
          className="block p-4 pl-10 md:w-[540px] h-5 text-sm leading-normal bg-primary-black rounded-lg placeholder-zinc-400 text-white"
          placeholder="Search a post..."
        />
      </div>

      {isLoggedIn && <div className="cursor-pointer">{notificationSVG()}</div>}

      {!isLoggedIn && (
        <div
          className="flex px-2 py-1 pt-[5px] text-sm font-medium rounded-md border-[1px] cursor-pointer transition text-black bg-white hover:bg-primary-black hover:text-white hover:border-white"
          onClick={userLogin()}
        >
          Login
          <div className="ml-0.5">{loginSVG()}</div>
        </div>
      )}

      {isLoggedIn && userIcon()}
    </div>
  );
};
