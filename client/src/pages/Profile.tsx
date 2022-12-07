import { FC, useEffect, useRef } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { UserSearch } from '../feature/Search';
import { TopUser } from '../feature/TopUser';
import { Trending } from '../feature/trending';
import { UserProfile } from '../feature/UserProfile';

export const Profile: FC = (): JSX.Element => {
  return (
    // <div className="fixed inset-0 right-0 mt-[56px] flex flex-col items-center justify-center w-full z-10 h-[calc(100%-56px)] bg-primary-black overflow-auto">
    <div className="absolute flex flex-col justify-start items-center top-0 mt-[56px] h-full w-full">
      <div className=" w-[1024px] bg-post-bg-black">
        <div className=" bg-primary-black">
          <UserProfile />
        </div>
        <div className="w-[1024px] flex justify-end">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Profile;
