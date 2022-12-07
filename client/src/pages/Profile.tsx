import { FC, useEffect, useRef } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { UserSearch } from '../feature/Search';
import { TopUser } from '../feature/TopUser';
import { Trending } from '../feature/trending';
import { UserProfile } from '../feature/UserProfile';

export const Profile: FC = (): JSX.Element => {
  return (
    <div className="flex justify-center bg-primary-black">
      <UserProfile />
    </div>
  );
};

export default Profile;
