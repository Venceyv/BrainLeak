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
import { getUser } from '../api/userAPI';
import { useQuery } from '@tanstack/react-query';

export const Profile: FC = (): JSX.Element => {
  const { userId } = useParams();
  const { data, isSuccess, isError } = useQuery(
    ['userData'],
    () => getUser(userId!),
    { refetchOnWindowFocus: false, cacheTime: 0, retry: 1 }
  );

  return (
    <div className="absolute flex flex-col justify-start items-center top-0 mt-[56px] w-full bg-primary-black min-h-[calc(100vh-56px)] overflow-auto">
      <UserProfile />
      <div className="grid grid-cols-5 w-full max-w-[1024px]">
        <ProfileCatalog isDelete={data?.isDelete ? true : false} />
      </div>
    </div>
  );
};

export default Profile;
