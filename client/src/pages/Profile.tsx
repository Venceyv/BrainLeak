import { FC, useEffect, useRef, useState } from 'react';
import {
  Navigate,
  Outlet,
  useNavigate,
  useParams,
} from 'react-router-dom';
import { ProfileMenu } from '../feature/ProfileCatalog/components/ProfileMenu';
import { useApplyFocus } from '../feature/AbstractPost/components/PostFilterBar.hook';
import { UserSearch } from '../feature/Search';
import { TopUser } from '../feature/TopUser';
import { Trending } from '../feature/trending';
import { UserProfile } from '../feature/UserProfile';
import { SortByMenu } from '../feature/ProfileCatalog/components/SortByMenu';
import { ProfileCatalog } from '../feature/ProfileCatalog';

export const Profile: FC = (): JSX.Element => {
  // type menuCategory =
  //   | 'my-posts'
  //   | 'bookmarked'
  //   | 'liked-posts'
  //   | 'comment-history';
  // const navigate = useNavigate();
  // const [menuCategory, setMenuCategory] =
  //   useState<menuCategory>('my-posts');

  // useEffect(() => {
  //   navigate(menuCategory);
  // }, []);

  return (
    // <div className="fixed inset-0 right-0 mt-[56px] flex flex-col items-center justify-center w-full z-10 h-[calc(100%-56px)] bg-primary-black overflow-auto">
    // <div className="absolute flex flex-col justify-start items-center top-0 mt-[56px] w-full bg-primary-black min-h-screen overflow-auto">
    //   <div className="grid grid-cols-3 w-[1024px] min-h-[100%-56px] bg-post-bg-black">
    //     <div className="flex flex-col col-span-3 gap-28 items-end h-[522px] bg-post-bg-black">
    //
    //       <ProfileMenu setMenuCategory={setMenuCategory} />
    //     </div>
    //     <div className="col-start-2 col-span-2 flex flex-col items-end pr-12 bg-post-bg-black">
    //       <Outlet />
    //     </div>
    //   </div>
    // </div>
    <div className="absolute flex flex-col justify-start items-center top-0 mt-[56px] w-full bg-primary-black min-h-[calc(100vh-56px)] overflow-auto">
      <UserProfile />
      <div className="grid grid-cols-5 w-full max-w-[1024px]">
        <ProfileCatalog />
      </div>
    </div>
  );
};

export default Profile;
